from flask import Flask, render_template, request, redirect, url_for, session
from functools import wraps

app = Flask(__name__)
app.secret_key = "clave_secreta"  # necesaria para sesiones


# Decorador para proteger rutas
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "usuario" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function


# Rutas publicas
@app.route('/')
def home():
    return render_template('public/index.html')


@app.route('/informacion')
def informacion():
    return render_template('public/informacion.html')


@app.route('/login', methods=["GET", "POST"])
def login():

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        # usuario de ejemplo
        if username == "admin" and password == "1234":
            session["usuario"] = username
            return redirect(url_for("dashboard"))
        else:
            return "Usuario o contraseña incorrectos"

    return render_template('public/login.html')


@app.route("/logout")
def logout():
    session.pop("usuario", None)
    return redirect(url_for("home"))


# Rutas privadas
@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('private/dashboard.html')


@app.route('/sensores')
@login_required
def sensores():
    return render_template('private/sensores.html')


@app.route('/historial')
@login_required
def historial():
    return render_template('private/historial.html')


@app.route('/control')
@login_required
def control():
    return render_template('private/control.html')


@app.route('/cultivos')
@login_required
def cultivos():
    return render_template('private/cultivos.html')


@app.route('/alertas')
@login_required
def alertas():
    return render_template('private/alertas.html')


@app.route('/configuracion')
@login_required
def configuracion():
    return render_template('private/configuracion.html')


if __name__ == '__main__':
    app.run(debug=True)