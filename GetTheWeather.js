//The class where each day info is going to be stored
//the humidity is the sum of all values through out the day but the getter will only show the average
class WeatherDay {

    constructor(newDate, humidity, maxTemp) {
        this.countHumidity=1; 
        this._date = newDate;
        this._humidity = humidity;
        this._maxTemp = maxTemp;
    }
    set date(newDate){
        this._date=newDate;
    }   

    get date() {
      return this._date;
    }
    
    get maxTemp(){
        return this._maxTemp;
    }

    get humidity(){
        return this._humidity/this.countHumidity;
    }

    AddHumidity(newH) {
      this._humidity += newH;
      this.countHumidity++;
    }

    UpdateMaxTemp(newTemp){
        if(newTemp>this._maxTemp)
            this._maxTemp=newTemp;
    }

  }

//Little function just to add zeros on the left of the number if needed.
function zeroPad(num, places) {
    return String(num).padStart(places, '0')
}

//Get a date and puts it with the chosen format
DateToString= function(date)
{
    return zeroPad(date.getDate(),2) + " " + zeroPad(date.getMonth() + 1,2) + " " + zeroPad(date.getFullYear(),4);
}

//Get the data from the other website
GetData = function(Url, Callback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function() {
        var Done = 4, OK = 200;
        if (anHttpRequest.readyState == Done && anHttpRequest.status == OK)
            Callback(anHttpRequest.responseText);
    }
    //Problems with CORS, had to use a proxy
    proxy="https://cors-anywhere.herokuapp.com/";
    anHttpRequest.open( "GET", proxy+Url, true );            
    anHttpRequest.send( null );
}

//Update the values of a certain day or adds a new day on the list
UpdateValuesOnTheList = function(list,date,humidity,temp_max)
{
    for(var idx = 0 ; idx < list.length;idx++)
    {
        if(list[idx].date==date)
        {
            list[idx].UpdateMaxTemp(temp_max);
            list[idx].AddHumidity(humidity);
            return list;
        }
    }
    list.push(new WeatherDay(date,humidity,temp_max));
    return list;
}

//Get the list of data and transforms it in a list of days with everything done
GetDays =  function(arr)
{
    weatherDays = []
    for(var idx = 0;idx<arr.length;idx++)
    {
        var element = arr[idx];
        var date = DateToString(new Date(element.dt_txt));
        var humidity = element.main.humidity;
        var temp_max = element.main.temp_max;
        weatherDays = UpdateValuesOnTheList(weatherDays,date,humidity,temp_max);
    }

    return weatherDays;
}


FromValueToTH =function(value)
{
    var th = document.createElement("th");
    th.innerText=value;
    return th;
}

FormatFloat = function(num)
{
    return parseFloat(num).toFixed(3)
}

FromDayToTR = function(day)
{
    var tr = document.createElement("tr");
    var k = day.maxTemp;
    var c = k-272.15;
    var f = c*(9/5)+32;
    values = [day.date.toString(), FormatFloat(day.humidity), 
		FormatFloat(k),FormatFloat(c),FormatFloat(f)]
    for(var idx=0;idx<values.length;idx++)
        tr.appendChild(FromValueToTH(values[idx]));
    return tr;
}