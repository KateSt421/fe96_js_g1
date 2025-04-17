const buttonCatalog=document.querySelector(`.text2_button_catalog`);
buttonCatalog.addEventListener(`click`,function (){
    const catalogSection=document.getElementById(`plant-details`);
    if(catalogSection){
        catalogSection.scrollIntoView({
            behavior:`smoth`
        });
    }else{
        alert(`Раздел каталога не найден`);
    }
      })