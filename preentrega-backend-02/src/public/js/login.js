document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById('loginForm');

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formLogin);
        const userData = Object.fromEntries(formData);

        // Validar que los campos no estén vacíos
        if (!userData.email || !userData.password) {
            console.log("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/sessions/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            // Verificar si la respuesta es válida antes de parsearla como JSON
            if (!response.ok) {
                const errorText = await response.text(); // Leer respuesta como texto
                console.error("Error en login:", errorText);
                return;
            }

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (data?.message === "Usuario logueado correctamente" && data.redirectTo) {
                e.target.reset();
                window.location.href = `http://localhost:8080${data.redirectTo}`; // 🔹 Redirige con la ruta del backend
            } else {
                console.log("Error en login:", data);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });
});




// document.addEventListener("DOMContentLoaded", () => {
//     const formLogin = document.getElementById('loginForm')
    
//     formLogin.addEventListener('submit', async (e) => {
//         e.preventDefault()
      
//         const formData = new FormData(formLogin)
        
//         const userData = Object.fromEntries(formData)
    
//         try {
         
//             const response = await fetch('http://localhost:8080/api/sessions/login', {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(userData),
//                 credentials: "include" 
    
    
//             })
           
//             const data = await response.json()
            
//             if (data?.message === "Usuario logueado correctamente") {
//                 window.location.href = "http://localhost:8080/products"
           
            
//             } else {
               
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     })
// })