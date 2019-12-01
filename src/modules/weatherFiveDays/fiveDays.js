export const changeToFiveDays = async function() {
    const x = fetchFromApi('Wrocław');
    };

    
const apiKey = '18ab372b1fc6ef784c0191c7e088d9a2';
const query = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const units = 'metric';


function fetchFromApi(cityInput){
    fetch(`${query}${cityInput}&APPID=${apiKey}&units=${units}`)
       .then(resp => resp.json()) 
       .then(resp => {render(resp)})
       .catch(reject => console.log('Rejected: ' + reject))
     }

     function render(x) {
        $.get('/src/modules/weatherFiveDays/fiveDays.mst', function(template) {
            console.log(x)
            const result = Mustache.to_html(template, x.list[0]);
            $('.main').html(result);
            doAfter(x) ;
        });
        }
    


const plday= a =>{
    if(a==0){
        return "Niedziela";
    }
    if(a==1){
        return "Poniedziałek";
    }
    if(a==2){
        return "Wtorek";
    }
    if(a==3){
        return "Środa";
    }
    if(a==4){
        return "Czwartek";
    }
    if(a==5){
        return "Piątek";
    }
    if(a==6){
        return "Sobota";
    }
}



function doAfter(resp){
    const a =(resp.list[0].main.temp);//temperatura;
    const b =(resp.list[7].main.temp);
    const c =(resp.list[15].main.temp);
    const d =(resp.list[23].main.temp);
    const e =(resp.list[31].main.temp);
    const f =(resp.list[39].main.temp);
    
    let daya =new Date(resp.list[0].dt_txt).getUTCDay();//dzień
    let dayb =new Date(resp.list[7].dt_txt).getUTCDay();
    let dayc =new Date(resp.list[15].dt_txt).getUTCDay();
    let dayd =new Date(resp.list[23].dt_txt).getUTCDay();
    let daye =new Date(resp.list[31].dt_txt).getUTCDay();
    let dayf =new Date(resp.list[39].dt_txt).getUTCDay();

    let pldaya= plday(daya);//dzień po polsku
    let pldayb= plday(dayb);
    let pldayd= plday(dayd);
    let pldayc= plday(dayc);
    let pldaye= plday(daye);
    let chart= document.getElementById('myChart').getContext('2d');//wykress
   
    let day= new Chart (myChart, {   
        type:'line',
           
           data:{
               labels:[pldaya,pldayb,pldayc,pldayd,pldaye ],
               datasets:[{
                   label:'Temperatura',
                   backgroundColor:'#f9f9c5',
                   borderColor:'#ffbe1c',
                   data:[
                       a,
                       b,
                       c,
                       d,
                       e
                   ]
               }],
               
    
            },
            options:{
                responsive:true,
                legend: {
                    display: false,
                scales:{
                    yAxes:[{
                        ticks:{ 
                            beginAtZero: true,
    
                        }
                    }]
    
                }
            }
        }
}


    )}