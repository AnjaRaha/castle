var rp = require('request-promise');
const cheerio = require('cheerio');

const getByPage = async(numPage) => {
    var options = {
        method: 'POST',
        uri: 'https://www.relaischateaux.com/fr/update-destination-results',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: 'areaId=78&&page='+numPage 

    };

    return rp(options)
        .then(function(data) {
            let result = [];
            const content = JSON.parse(data);
            const $ = cheerio.load(content.html);
            $(".hotelQuickView ").each(function (index, element) {
                var name = $(element).find('span[itemprop="name"]').text();
                var rate = $(element).find('div.rate').attr("data-reviewrate");
                var price = $(element).find(".price").children('span[property="price"]').html();
                var objet = {name:name,rate:rate, price: price};
                result.push(objet);
            });
            return result;
        })
        .catch(function(err) {
            console.log(err);
        });      
}

const getAll = async() => {
    let relaisData = [];
    for(let i = 1; i<=8; i++) {
        const resultByPage = await getByPage(i);
        relaisData.push(resultByPage);
    }
    var relaisDataFinal =  relaisData.flat();
    return relaisDataFinal;
}

module.exports = {get: getAll};