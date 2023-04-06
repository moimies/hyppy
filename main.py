from flask import Flask
from flask import render_template


app = Flask(__name__)

@app.route("/hyppy")
def hyppy():
    return render_template("hyppy.html")



if __name__ == "__main__":
    app.run(debug=1)


