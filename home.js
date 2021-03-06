 const http=require("http");
 const fs=require("fs");
 var requests=require("requests");
 const homeFile=fs.readFileSync("index.html","utf-8");

 const replaceVal=(tempVal,orgVal)=>{
     let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);
     temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
     temperature=temperature.replace("{%location%}",orgVal.main.name);
    //  temperature=temperature.replace("{%country%}",orgVal.main.sys.country);
     return temperature;
 }
  const server=http.createServer((req,res)=>{
      //data streaming
      if(req.url=="/"){
          requests(
              "http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=fc9914b0e5671e88ffeb1d156906c5fc"
             )
             .on("data",(chunk)=>{
                 const objData=JSON.parse(chunk);
                 const arrData=[objData];
                //  console.log(arrData[0].main.temp);
                const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
                res.write(realTimeData);
             })
             .on("end",(err)=>{
                 if(err)return console.log("Error",err);
                 res.end;
             });

      }
  });
  server.listen(8000,"127.0.0.1");