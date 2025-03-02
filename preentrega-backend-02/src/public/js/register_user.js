// document.addEventListener("DOMContentLoaded", () => {
//     const formRegister = document.getElementById('registerForm')
    
//     formRegister.addEventListener('submit', async (e) => {
//         e.preventDefault()
      
//         const formData = new FormData(formRegister)
        
//         const userData = Object.fromEntries(formData)
    
//         try {
//             console.log(userData);
            
//             const response = await fetch('http://localhost:8080/api/sessions/register', {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(userData),
//                 credentials: "include" 

//             })

//             // Verificar si la respuesta es válida antes de parsearla como JSON
//             if (!response.ok) {
//                 const errorText = await response.text(); // Leer respuesta como texto
//                 console.error("Error en login:", errorText);
//                 return;
//             }
           
//             const data = await response.json()
            
//             if (data?.message === "Usuario registrado correctamente" && data.)redirectTo {
//                 e.target.reset();
//                 window.location.href = `http://localhost:8080${data.redirectTo}`;
//             } else {
//                 console.log("Error en el registro:", data);
//             }
//         } catch (e) {
//             console.error("Error en la solicitud:", error);
//         }
//     })
// })

document.addEventListener("DOMContentLoaded", () => {
    const formRegister = document.getElementById('registerForm');
    
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
      
        const formData = new FormData(formRegister);
        
        const userData = Object.fromEntries(formData);
    
        try {
            console.log(userData);
            
            const response = await fetch('http://localhost:8080/api/sessions/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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
            
            if (data?.message === "Usuario registrado correctamente" && data.redirectTo) {
                e.target.reset();
                window.location.href = `http://localhost:8080${data.redirectTo}`;
            } else {
                console.log("Error en el registro:", data);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });
});
