var rp = require('request-promise');
const cheerio = require('cheerio');


const getByPageMichelin = async(numPage) => {
    const options ={
        uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-"+numPage,
        transform: function(body){
            return cheerio.load(body);
        }

};
return rp(options)
.then($ =>{
    let resultsData = [];
    $(".poi_card-description").each(function (index, element) {
    let oneStars = $(element).find(".poi_card-display-title").text().trim();
    let dataMichelin = { name : oneStars };
    resultsData.push(dataMichelin);
});
return resultsData;
})
.catch(err=>{
    console.log(err);
});
};

const getAllMichelin = async() => {
    let michelinData = [];
    for(let i = 1; i<=35; i++) {
        const resultByPage = await getByPageMichelin(i);
        michelinData.push(resultByPage);

    }
    let relaisDataFinal = michelinData.flat();
    return relaisDataFinal;
}
module.exports = {get : getAllMichelin};
