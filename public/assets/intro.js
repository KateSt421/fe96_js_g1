// Функция для кнопки "Выбрать" для перехода к каталогу
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

// Функция для изображения рейтинга в яндекс для перехода на ссылку с адресом магазина
      document.querySelector(`.yandex_map`).addEventListener(`click`,function(){
        window.location.href="https://yandex.ru/maps/org/krapiva/228180338570/?ll=37.640482%2C55.740109&mode=search&sll=37.640482%2C55.740109&sspn=0.136860%2C0.058641&text=Магазины растений&z=13.4";
      })