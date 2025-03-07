document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
        name: form.querySelector('input[placeholder="Enter your name"]').value,
        email: form.querySelector('input[placeholder="Enter your email"]').value,
        password: form.querySelector('input[placeholder="Create password"]').value
      };
      
      console.log('Form Data:', formData);
      saveData(formData);
    });
    
    const saveData = (data) => {
      const jsonData = JSON.stringify(data);
      localStorage.setItem('formData', jsonData);
      alert('Form data saved!');
    };
  });