const loadPhonesData = async (search, dataLimit) => {
    try{
        const res = await fetch (`https://openapi.programming-hero.com/api/phones?search=${search}`);
        const data = await res.json();
        displayPhones(data.data, dataLimit);    
    }
    catch(err){
        console.log(err);
    }
}
const searchProcess = (dataLimit) => {
    const searchFld = document.getElementById('search-Fld');
    loadPhonesData(searchFld.value, dataLimit);
    // searchFld.value = '';
};

document.getElementById('btn-search').addEventListener('click', ()=>{
    // const searchFld = document.getElementById('search-Fld').value;
    // loadPhonesData(searchFld, 5);
    searchProcess(5);
})
document.getElementById('search-Fld').addEventListener('keyup', (e)=>{
    // const searchFld = document.getElementById('search-Fld').value;
    if (e.key === "Enter"){
        // loadPhonesData(searchFld, 5);
        searchProcess(5);
        toggleSpinner(true);
    } 
})
document.getElementById('btn-showAll').addEventListener('click', ()=>{
    // const searchFld = document.getElementById('search-Fld').value;
    // loadPhonesData(searchFld);
    searchProcess();
    toggleSpinner(true);

})

const displayPhones = (data, dataLimit) => {
    const phoneContainer = document.getElementById('phone-container');
    const searchMessage = document.getElementById('search-message');
    const btnShowAll =document.getElementById('btn-showAll');
    
    data.length === 0? searchMessage.classList.remove('d-none'):searchMessage.classList.add('d-none');
    toggleSpinner(false);
    data.length > dataLimit?  btnShowAll.classList.remove('d-none') : btnShowAll.classList.add('d-none');
    phoneContainer.innerHTML="";

    data.slice(0,dataLimit).forEach(phone => {
        const {brand, image, phone_name, slug} = phone;
        const colDiv = document.createElement('div');
        colDiv.classList.add('col');
        colDiv.innerHTML = `
            <div class="card">
                <img src="${image}" class="card-img-top" alt="phone-Image" width= "100%">
                <div class="card-body">
                    <h5 class="card-title">${phone_name}</h5>
                    <p class="card-text">Brand: ${brand}</p>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#phoneDetailsModal" onclick="seeDetails('${slug}')">
                    See Details
                    </button>
                </div>
                
            </div>
        `;
        phoneContainer.appendChild(colDiv);
    });
    
}
const toggleSpinner = isLoading => {
    const spinner = document.getElementById('load-spinner');
    isLoading? spinner.classList.remove('d-none'):spinner.classList.add('d-none')
}

const seeDetails = async id => {
    const res = await fetch (`https://openapi.programming-hero.com/api/phone/${id}`);
    const data = await res.json();
    modalDetails(data.data);
}

const modalDetails = (data) => {
    const modalTitle = document.getElementById('phoneDetailsModalLabel'); 
    const modalBody = document.getElementById('modal-inner');
    const {brand, image, name, slug, mainFeatures, others} = data;
    const {chipSet, memory, sensors, storage} = mainFeatures;
    modalTitle.innerText = `${name}`;
    modalBody.innerHTML = `
            <p><span class="fw-bold">Name: </span><span>${name}</span></p> 
            <p><span class="fw-bold">Brand: </span><span>${brand}</span></p> 
            <p><span class="fw-bold">Chipset: </span><span>${chipSet? chipSet: 'info N/A'}</span></p> 
            <p><span class="fw-bold">Memory: </span><span>${memory? memory: 'info N/A'}</span></p> 
            <p><span class="fw-bold">Storage: </span><span>${storage? storage: 'info N/A'}</span></p> 
    `;
};