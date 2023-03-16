let inputSearch = document.querySelector('#search');
let formSearch  = document.querySelector('.form');
let listRepositories = document.querySelector('.list');
let blockError = document.querySelector('.info_error');


formSearch.addEventListener('submit', (e)=>{

    e.preventDefault();

    while (inputSearch.value[0] === ' ') {
        inputSearch.value = inputSearch.value.slice(1)
    }

    if (inputSearch.value === '') {
        blockError.style = 'color: #f00606';
        return
    }

    listRepositories.innerHTML = '';

    getRepositories(inputSearch.value)
    .then(response => {

        if (response.total_count == 0) {
            return listRepositories.innerHTML = `<li class="empty">&#129396; по запросу "${inputSearch.value}" ничего не найдено...</li>`;
        }

        listRepositories.innerHTML = `<li class="count">по запросу "${inputSearch.value}" найдено ${response.total_count} репозиториев github</li>`;

        response.items.forEach(item=>{
            listRepositories.innerHTML += `
            <li class="item" key="${item.id}">
                <div class="item_name"><a href="${item.html_url}" target="_blank">${item.full_name}</a></div>
                <div class="item_description">${item.description || "нет данных"}</div>
                <div class="item_footer">
                    <div class="item_star">&#11088; <span>${item.stargazers_count}</span></div>
                    <div class="item_update">последнее обновление: ${ timeConverter(item.updated_at) }</div>
                </div>
            </li>
            `
        })

        if (response.total_count > 10) {
            let urlFullList = `https://github.com/search?q=${inputSearch.value}+in%3Aname%2Cdescription&type=Repositories`;
            listRepositories.innerHTML += `<li class="full_list">с полным списком можно ознакомитьтся <a href="${urlFullList}" target="_blank">ЗДЕСЬ</a></li>`;
        }
    })
    .catch(()=>{
        console.log('error');
        listRepositories.innerHTML = `<li class="error">Ошибка! Что то пошло не так! Проверьте соединение с интернетом, корректность запроса, обновите страницу</li>`
    })
    .finally(()=>{
        inputSearch.value = '';
    })

})

inputSearch.addEventListener('input', ()=>{
    blockError.style = 'color: #fff';
})

function timeConverter(time){
    let a = new Date(time);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();

    return `${date} ${month} ${year}`
}


async function getRepositories(keyWord) { 
    let response = await fetch(`https://api.github.com/search/repositories?q=${keyWord}+in%3Aname%2Cdescription&per_page=10`);
  
    if (response.status == 200) {
      let json = await response.json(); 
      return json;
    }
  
    throw new Error();
}
