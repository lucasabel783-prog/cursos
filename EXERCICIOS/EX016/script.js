function updateClock(){
            const now = new Date();
            const time = now.toLocaleTimeString('pt-PT');
            document.getElementById("clock").textContent = time;
        }

        setInterval(updateClock, 1000);
        updateClock();

        function login(){
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    const msg = document.getElementById("msg");

    if(user === "admin" && pass === "1234"){
        msg.style.color = "#00ff88";
        msg.textContent = "Login bem-sucedido!";
    } else {
        msg.style.color = "#ff5555";
        msg.textContent = "Usuário ou senha incorretos";
    }
}