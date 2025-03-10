async function getData(CountryName) {
    const url = `https://restcountries.com/v3.1/name/${CountryName}`; 
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
  
      
      json.forEach(async (value) => {
        const capital = value.capital ? value.capital[0] : 'N/A';
        const population = value.population;
        const region = value.region;
        const flag = value.flags.png;  
        console.log(capital);
        console.log(population);
        console.log(region);
        console.log(flag);
  
        
        const countyinfo = document.getElementById("country-info");
        countyinfo.innerHTML = `
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Population:</strong> ${population}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Flag:</strong> <img src="${flag}" alt="Flag" width="100"></p>
        `;
        
        
        if (value.borders && value.borders.length > 0) {
          const borderingFlagsAndNames = await getBorderingFlags(value.borders);
          const borderingSection = document.getElementById("bordering-countries");
          borderingSection.innerHTML = "<h3>Bordering Countries' Flags and Names:</h3>";
  
         
          borderingFlagsAndNames.forEach(item => {
            borderingSection.innerHTML += `<p>${item.name}</p>`;
            borderingSection.innerHTML += `<p><img src="${item.flag}" alt="Neighbor Flag" width="50"></p>`;
          });
        }
      });
  
    } catch (error) {
      console.error(error.message);
    }
}
  

async function getBorderingFlags(borders) {
    const borderInfo = [];
    
    for (const borderCode of borders) {
      const borderUrl = `https://restcountries.com/v3.1/alpha/${borderCode}`;
      try {
        const response = await fetch(borderUrl);
        if (response.ok) {
          const borderData = await response.json();
          const borderFlag = borderData[0].flags.png;  
          const borderName = borderData[0].name.common;  
          borderInfo.push({ name: borderName, flag: borderFlag }); 
        }
      } catch (error) {
        console.error("Error fetching neighboring country:", error.message);
      }
    }
    return borderInfo;
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
