document.addEventListener('DOMContentLoaded', function() {
    const validateBtn = document.getElementById('validateBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const cedulaInput = document.getElementById('cedula');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultIcon = document.getElementById('resultIcon');
    const cedulaDetails = document.getElementById('cedulaDetails');
    const tipoCedulaSpan = document.getElementById('tipoCedula');
    const secuenciaSpan = document.getElementById('secuencia');
    const digitoVerificadorSpan = document.getElementById('digitoVerificador');
    
    validateBtn.addEventListener('click', validateCedula);
    tryAgainBtn.addEventListener('click', resetForm);
    cedulaInput.addEventListener('input', formatCedula);
    
    function formatCedula() {
        // Remove any non-digit characters
        let value = cedulaInput.value.replace(/\D/g, '');
        
        // Limit to 11 characters
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        cedulaInput.value = value;
    }
    
    function validateCedula() {
        const cedula = cedulaInput.value.trim();
        
        // Reset any previous error state
        cedulaInput.classList.remove('input-error');
        
        // Basic validation
        if (cedula.length !== 11) {
            showError("La cédula debe tener 11 dígitos");
            return;
        }
        
        if (!/^\d+$/.test(cedula)) {
            showError("La cédula solo debe contener números");
            return;
        }
        
        // Validate check digit (last digit)
        const digitoVerificador = parseInt(cedula[10]);
        const digitoCalculado = calcularDigitoVerificador(cedula.substring(0, 10));
        
        if (digitoVerificador !== digitoCalculado) {
            showError(`El dígito verificador no es válido. Esperado: ${digitoCalculado}, Ingresado: ${digitoVerificador}`);
            return;
        }
        
        // If all validations pass
        showSuccess(cedula, digitoVerificador);
    }
    
    function calcularDigitoVerificador(diezDigitos) {
        // Algoritmo corregido para cédulas dominicanas
        let suma = 0;
        
        for (let i = 0; i < diezDigitos.length; i++) {
            let digito = parseInt(diezDigitos[i]);
            let multiplicador = (i % 2 === 0) ? 1 : 2;
            let producto = digito * multiplicador;
            
            // If product has two digits, sum them
            if (producto > 9) {
                producto = producto.toString();
                producto = parseInt(producto[0]) + parseInt(producto[1]);
            }
            
            suma += producto;
        }
        
        const decenaSuperior = Math.ceil(suma / 10) * 10;
        return decenaSuperior - suma;
    }
    
    function showError(message) {
        // Add error animation and styling
        cedulaInput.classList.add('input-error');
        
        // Show result section with error
        resultSection.classList.remove('hidden');
        resultContent.className = 'p-6 text-white text-center error-bg';
        resultIcon.className = 'w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl text-red-500';
        resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        resultTitle.textContent = 'Cédula Inválida';
        resultMessage.textContent = message;
        cedulaDetails.classList.add('hidden');
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showSuccess(cedula, digitoVerificador) {
        // Determine type of ID (CED or RNC)
        const tipo = cedula.startsWith('1') ? 'Cédula Personal' : 
                    cedula.startsWith('4') ? 'Cédula Extranjero' : 'Cédula Regular';
        
        // Show result section with success
        resultSection.classList.remove('hidden');
        resultContent.className = 'p-6 text-white text-center success-bg';
        resultIcon.className = 'w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl text-green-500';
        resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        resultTitle.textContent = 'Cédula Válida';
        resultMessage.textContent = `La cédula ${formatCedulaDisplay(cedula)} es válida según el algoritmo módulo 10.`;
        
        // Show details
        tipoCedulaSpan.textContent = tipo;
        secuenciaSpan.textContent = cedula.substring(0, 10);
        digitoVerificadorSpan.textContent = digitoVerificador;
        cedulaDetails.classList.remove('hidden');
        
        // Add glow effect to the card
        const card = document.querySelector('.bg-white');
        card.classList.add('glow');
        setTimeout(() => card.classList.remove('glow'), 2000);
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function formatCedulaDisplay(cedula) {
        // Format as 000-0000000-0
        return `${cedula.substring(0, 3)}-${cedula.substring(3, 10)}-${cedula.substring(10)}`;
    }
    
    function resetForm() {
        // Hide result section
        resultSection.classList.add('hidden');
        
        // Reset input
        cedulaInput.value = '';
        cedulaInput.focus();
        
        // Remove any error state
        cedulaInput.classList.remove('input-error');
    }
});