// Created by Tibor Boros


// Load the buttons 
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    // Setup an event listener for each button
    button.addEventListener('click', () => {
        if (button.innerText === "Refresh") {
            updateTable();
        };
        if (button.innerText === "Save as CSV") {
            tableToCSV();
        };

    })
});

displayTable();

function updateTable(jsonData) {
    clearTable();
    displayTable();
}

function clearTable() {
    let table = document.getElementById("table");
    // Clear table
    table.remove();
}

async function displayTable() {
    let jsonData = await getElements();

    // Get the container element where the table will be inserted
    let container = document.getElementById("container");
    // Create the table element
    let table = document.createElement("table");
    // Add id and class to the table
    table.setAttribute("id", "table");
    table.classList.add("col-12")
    // Get the keys (column names) of the first object in the JSON data
    let cols = Object.keys(jsonData[0]);
    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    // Loop through the column names and create header cells
    cols.forEach((item) => {
        let th = document.createElement("th");
        let a = document.createElement("a");
        // Adding attributes to a elemnt 
        a.setAttribute("href", "#");
        a.setAttribute("id", "list-header");
        // Add Bootstrap classes
        a.classList.add("list-group-item");
        a.classList.add("list-group-item-dark");
        // Set the headers from the JSON to start with capital  
        a.innerText = item.charAt(0).toUpperCase() + item.slice(1);
        // Setup the event listener on the headers
        a.addEventListener('click', () => {
            // Picking the right column name for sorting
            const active = cols.indexOf(a.innerText.toLowerCase());
            // Picking all the headers
            const classes = document.querySelectorAll("a");
            // Sortuing the table by the clicked condition
            let sorted = jsonData.sort(function (c, b) {
                const comp = a.innerText.toLowerCase();
                const i = (c[comp]);
                const j = (b[comp]);
                return `${i}`.localeCompare(`${j}`, undefined, { numeric: true });
            });

            refreshTable(sorted, active);
            // Remove the actibe class
            classes.forEach((elem) => {
                elem.classList.remove("active");
            });
            // Add active class for the chosen column
            a.classList.add("active");
        })
        // Append the header cell to the header row
        tr.appendChild(th);
        // Append the a element to the header cell
        th.appendChild(a);
    });
    // Append the header row to the header
    thead.appendChild(tr);
    // Append the header to the table
    table.append(tr);
    // Loop through the JSON data and create table rows
    jsonData.forEach((item) => {
        let tr = document.createElement("tr");
        // Get the values of the current object in the JSON data
        let vals = Object.values(item);
        // Loop through the values and create table cells
        vals.forEach((elem) => {
            let td = document.createElement("td");
            // Set the value as the text of the table cell
            td.innerText = elem;
            // Append the table cell with show class
            td.classList.add("show")
            // Append the table cell to the table row
            tr.appendChild(td);
        });
        // Append the table row to the table
        table.appendChild(tr);
    });
    // Append the table to the container element
    container.appendChild(table);
    //Automatically click to load the table by Rank 
    const StartUpOrder = table.querySelectorAll("a");
    StartUpOrder[0].click();

}

// Function to update the table by the clicked row
function refreshTable(a, b) {

    let tr = document.querySelectorAll("tr");
    let td = document.querySelectorAll("td");
    let temp = 0;

    tr.forEach(element => {
        const setTd = element.querySelectorAll("td");
        let temp = 0;
        setTd.forEach(elem => {
            if (temp === b) {
                elem.classList.add("active");
                temp++;
            } else {
                elem.classList.remove("active");
                temp++;
            };
        });

    });

    a.forEach((item) => {
        let vals = Object.values(item);
        vals.forEach((elem) => {
            td[temp].innerText = elem;
            temp++;
        })

    });

}

// Function to convert JSON data to array
async function getElements() {
    // Create an empty list
    let result = [];
    // Create a variable to upload additional info
    const racename = document.getElementById("racename");
    const gender = document.getElementById("gender");
    const length = document.getElementById("length");
    const lastUpdated = document.getElementById("lastUpdated");

    // Sample JSON data
    const api = await fetch("./Input/MarathonResults.JSON")
    // Hold result in a constans 
    const apiResp = await api.json();
    // Update infos
    racename.innerText = apiResp.results.racename;
    gender.innerText = "Gender:" + apiResp.results.gender;
    length.innerText =  "Length: "+apiResp.results.racelength+" km";
    lastUpdated.innerText = "Last Update: " + apiResp.results.lastupdated;

    // Loop through the athletes array
    apiResp.results.athletes.forEach(athlete => {
        // Add it to our list
        result.push(athlete);
    })
    return result;
}

// Function to create download link
function downloadCSVFile(csv_data) {

    // Create CSV file object and feed our csv_data into it
    CSVFile = new Blob([csv_data], { type: "text/csv" });

    // Create to temporary link to initiate download process
    var temp_link = document.createElement('a');

    // Download csv file
    temp_link.download = "race_results.csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    // Automatically click the link to trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}

// Function to create CSV from JSON
function tableToCSV() {

    // Variable to store the final csv data
    var csv_data = [];

    // Get each row data
    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {

        // Get each column data
        var cols = rows[i].querySelectorAll('a,td');

        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {

            // Get the text data of each cell of a row and push it to csvrow
            csvrow.push(cols[j].innerHTML);
        }

        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
        console.log(csv_data);
    }
    // Combine each row data with new line character
    csv_data = csv_data.join('\n');
    downloadCSVFile(csv_data);

}