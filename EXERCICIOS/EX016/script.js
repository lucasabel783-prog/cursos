function updateClock(){
            const now = new Date();
            const time = now.toLocaleTimeString('pt-PT');
            document.getElementById("clock").textContent = time;
        }

        setInterval(updateClock, 1000);
        updateClock();

       function criarConta() {
    const user = document.getElementById("user").value.trim();
    const pass = document.getElementById("pass").value.trim();
    const msg = document.getElementById("msg");

    if (!user || !pass) {
        msg.style.color = "#ff5555";
        msg.textContent = "Preencha usuário e senha!";
        return;
    }

    // salva no localStorage
    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    msg.style.color = "#00ff88";
    msg.textContent = "Conta criada com sucesso!";
}

function login() {
    const user = document.getElementById("user").value.trim();
    const pass = document.getElementById("pass").value.trim();
    const msg = document.getElementById("msg");

    const userSalvo = localStorage.getItem("user");
    const passSalva = localStorage.getItem("pass");

    if (user === userSalvo && pass === passSalva) {
        msg.style.color = "#00ff88";
        msg.textContent = "Login bem-sucedido!";
    } else {
        msg.style.color = "#ff5555";
        msg.textContent = "Usuário ou senha incorretos";
    }
}