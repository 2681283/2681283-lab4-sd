async function getData(CountryName) {
    const url = `https://restcountries.com/v3.1/name/${CountryName}`; 
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
  
      // Iterate over the response (multiple countries might be returned)
      json.forEach(async (value) => {
        const capital = value.capital ? value.capital[0] : 'N/A';
        const population = value.population;
        const region = value.region;
        const flag = value.flags.png;  // Access the flag image URL
    
        console.log(capital);
        console.log(population);
        console.log(region);
        console.log(flag);
  
        // Update the DOM with country info
        const countyinfo = document.getElementById("country-info");
        countyinfo.innerHTML = `
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Population:</strong> ${population}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Flag:</strong> <img src="${flag}" alt="Flag" width="100"></p>
        `;
        
        // If the country has neighbors, display their flags
        if (value.borders && value.borders.length > 0) {
          const borderingFlags = await getBorderingFlags(value.borders);
          const borderingSection = document.getElementById("bordering-countries");
          borderingSection.innerHTML = "<h3>Bordering Countries' Flags:</h3>";
  
          // Append the flags of neighboring countries
          borderingFlags.forEach(flagElement => {
            borderingSection.innerHTML += `<p>${flagElement}</p>`;
          });
        }
  
      });
  
    } catch (error) {
      console.error(error.message);
    }
  }
  
  // Function to fetch the country data of neighboring countries based on their alpha-3 code
  async function getBorderingFlags(borders) {
    const flagElements = [];
    
    for (const borderCode of borders) {
      const borderUrl = `https://restcountries.com/v3.1/alpha/${borderCode}`;
      try {
        const response = await fetch(borderUrl);
        if (response.ok) {
          const borderData = await response.json();
          const borderFlag = borderData[0].flags.png;  // Get the flag URL of the neighboring country
          flagElements.push(`<img src="${borderFlag}" alt="Neighbor Flag" width="50">`); // Add the flag to the array
        }
      } catch (error) {
        console.error("Error fetching neighboring country:", error.message);
      }
    }
    return flagElements;
  }
  
  // Adding event listener to the button
  document.getElementById('submit-btn').addEventListener('click', function() {
    const inputField = document.getElementById('country-name');
    const CountryName = inputField.value.trim();
  
    // Only fetch data if the country name is not empty
    if (CountryName) {
      getData(CountryName);
    } else {
      alert('Please enter a country name');
    }
  });
  
