const http = require('http')
const fs = require('fs')
const requests = require('requests')


const homeFile = fs.readFileSync('home.html', "utf-8")

const replaceVal = (tempVal, orgVal)=>{
    let temperature = tempVal.replace("{% tempval %}", orgVal.main.temp);
    temperature = temperature.replace("{% tempmin %}", orgVal.main.temp_min);
    temperature = temperature.replace("{% tempmax %}", orgVal.main.temp_max);
    temperature = temperature.replace("{% location %}", orgVal.name);
    temperature = temperature.replace("{% country %}", orgVal.sys.country);
    
    return temperature;
}


const server = http.createServer((req, res)=>{
    if(req.url == "/"){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=Mumbai&units=metric&appid=caabff1ae7b93db9e9d7809fd285c2f3"
        )

        .on("data", (chunk)=>{
            const objData = JSON.parse(chunk);
            const arrData = [objData]
            // console.log(arrData[0].main.temp);
            const realTimeData = arrData.map((val) =>replaceVal(homeFile, val)).join("")

            res.write(realTimeData)
            // console.log(realTimeData);
        })

        .on("end", (err)=>{
            if(err)
            return console.log("Connection closed due to errors");
            res.end();
        });
    }
    else{
        res.end("File not found")
    }
})


server.listen(8000, "localhost")