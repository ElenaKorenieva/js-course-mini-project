window.countriesBackup = [];

function filterCountries(search) {
    let filteredCountries = window.countriesBackup.filter(country => {
        return (country.name.toLowerCase().indexOf(search) > -1 
        || country.capital.toLowerCase().indexOf(search) > -1
        || country.region.toLowerCase().indexOf(search) > -1);
    });
    renderCountries(filteredCountries);
}


function setListeners() {
    let tableBody = document.querySelector('table tbody');
    tableBody.onclick = e => {
        e.target.classList.toggle('bg-warning')
        console.log(e.target.innerText);
    }

    let searchInput = document.getElementById('search');
    searchInput.onkeyup = e => {
        document.querySelector(`.countries-select`).value = '';
        let searchValue = e.currentTarget.value;
        //console.log(searchValue);
        let searchLower = searchValue.toLowerCase();
        filterCountries(searchLower);
    }
}
let a = 0;
let b = 0;

function buildSelect(countries) {
    let regions = countries.map(country => country.region);
    let uniqueRegions = [];
    for(let region of regions) {
        if(region && uniqueRegions.indexOf(region) === -1) {
            uniqueRegions.push(region);
        }
    }
    console.log(uniqueRegions);
    let regionHtml = uniqueRegions.reduce((acc, region) => acc + `<option value="${region}">${region}</option>`, 
        `<option value ="">Не выббрано</option>`)
    let regionSelect = document.createElement('select');
    //regionSelect.classList.add('form-control');
    regionSelect.className = 'form-control my-3 countries-select';
    regionSelect.innerHTML = regionHtml;
    document.querySelector('.countries-filters').prepend(regionSelect);
    document.querySelector(`.countries-select`).onchange = e => {
        document.getElementById('search').value = '';
        let value = e.currentTarget.value;
        let search = value.toLowerCase();
        filterCountries(search)

    }
}

function renderCountries(countries) {
    console.table(countries);
    let htmlTable = countries.reduce((acc, country, item) => acc + `<tr>
        <td>${item + 1}</td>
        <td>${country.name}</td>
        <td>${country.capital}</td>
        <td>${country.region}</td>
        <td>${country.population}</td>
        <td></td>
    </tr>`, '');
    document.querySelector('.container table tbody').innerHTML = htmlTable;
}

function loadCountries() {
    document.getElementById('load-countries').disabled = true;
    document.querySelector('.load-countries-spinner').classList.remove('hidden');
    fetch('https://restcountries.com/v2/all').then(res => res.json()).then(function(data) {
        let countries = data.map(function(country) {
            return {
                alpha3Code: country.alpha3Code,
                name: country.name,
                capital: country.capital || '',
                population: country.population,
                region: country.region,
                flag: country.flag,
                borders: country.borders || []
            }
        });
        window.countriesBackup = countries;
        b = new Date().getTime();
        console.log(b - a);
        document.getElementById('load-countries').disabled = false;
        document.querySelector('.load-countries-spinner').classList.add('hidden');
        document.querySelector('table').classList.remove('hidden');
        renderCountries(countries);
        buildSelect(countries);
        setListeners();
    });
}

let loadBtn = document.getElementById('load-countries');
loadBtn.onclick = function(e) {
    a = new Date().getTime();
    loadCountries();
}

document.querySelector('.google-link').onclick = e => {
    e.preventDefault();
    if(confirm('Are you sure')) {
        alert('Ну и зря');
        window.location.href = e.currentTarget.attributes.href.value;
    }
}