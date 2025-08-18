from flask import Flask, request, render_template, jsonify
from calc import compute

app = Flask(__name__)

@app.get("/")
def index():
    return render_template("index.html")

@app.get("/api/calc")
def api_calc():
    op = request.args.get("op", "add")
    try:
        a = float(request.args.get("a", "0"))
        b = float(request.args.get("b", "0"))
        result = compute(op, a, b)
        return jsonify({"op": op, "a": a, "b": b, "result": result})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
