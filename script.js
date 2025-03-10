document.addEventListener('DOMContentLoaded', () => {
    const countryInput = document.getElementById('country'); 
    const button = document.getElementById('submitcountry'); 
    const countryInfoSection = document.getElementById('country-info'); 
    const borderingCountriesSection = document.getElementById('bordering-countries'); 

    button.addEventListener('click', async function (event) {
        event.preventDefault(); 
        
        const countryName = countryInput.value.trim();

        if (countryName === "") {
            countryInfoSection.innerHTML = "<p style='color:red;'>Please enter a country name.</p>";
            return;
        }

        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            
            if (!response.ok) {
                throw new Error("Country not found");
            }

            const data = await response.json();
            const country = data[0]; // Get the first result
            
            const capital = country.capital ? country.capital[0] : "No capital available";
            const population = country.population.toLocaleString(); // Format with commas
            const region = country.region;
            const flag = country.flags.svg; 

            //country info
            countryInfoSection.innerHTML = `
            <ul class="square-list">
                <li><strong>Capital:</strong> ${capital}</li>
                <li><strong>Population:</strong> ${population}</li>
                <li><strong>Region:</strong> ${region}</li>
                <li><strong>Flag:</li>
                <img src="${flag}" alt="Flag of ${country.name.common}" class="country-flag">
            </ul>
            `;


            
            if (country.borders) {
                const borderCodes = country.borders.join(",");
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`);
                const borderData = await borderResponse.json();

                //bordering countries
                borderingCountriesSection.innerHTML = `<ul class="square-list">
                <li><strong>Bordering Countries:</li>
                 </ul>`;
                 borderData.forEach(neighbor => {
                    borderingCountriesSection.innerHTML += `
                        <section>
                            <ul class="square-list">
                                <li>
                                    <strong>${neighbor.name.common}</strong>
                                    <img src="${neighbor.flags.svg}" alt="Flag of ${neighbor.name.common}" class="country-flag">
                                </li>
                            </ul>
                        </section>
                    `;
                });
                
            } else {
                borderingCountriesSection.innerHTML = "<p>No bordering countries.</p>";
            }

        } catch (error) {
            countryInfoSection.innerHTML = `<p style='color:red;'>${error.message}</p>`;
            borderingCountriesSection.innerHTML = ""; 
        }
    });
});
