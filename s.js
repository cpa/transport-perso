async function rain(lat=48.8546,lon=2.3874) { // C'est Charonne / Léon Frot
    let rtmp = {};
    let tmp = "";
    let response = await fetch(`https://webservice.meteofrance.com/rain?token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__&lat=${lat}&lon=${lon}&lang=fr`);
    let data = await response.json();

    let ilVaPleuvoir = false;
    
    for (const x of data.forecast) {
	if (x.rain !== 1) {
	    ilVaPleuvoir = true;
	}

	let date = new Date(x.dt*1000);
	let minutes = mins = ('0'+date.getMinutes()).slice(-2);
	let horaire = date.getHours() + ':' + minutes;

	if (x.rain === 1) {
	    tmp += '<i class = "bi-emoji-laughing" style = "color: grey;" > </i >';
	} else {
	    tmp += '<i class = "bi-cloud-rain" style = "color: grey;" > </i >';
	}
        tmp += ' ' + horaire + '<br />';
    }

    if (!ilVaPleuvoir) {
	rtmp.icon = 'bi-emoji-laughing';
	rtmp.text = "";
    } else {
	rtmp.icon = 'bi-cloud-rain';
	rtmp.text = tmp;
    }

    return rtmp;
}

async function bus76() {
    let tmp = "";
    let response = await fetch("https://api-ratp.pierre-grimaud.fr/v4/schedules/buses/76/charonne+++philippe+auguste/R");
    let data = await response.json();

    for (const x of data.result.schedules) {
	tmp += x.message;
	tmp += "<br />";
    }
    return tmp;
}


async function main() {

    let bus = await bus76();
    document.getElementById('bus76').innerHTML = bus;

    let pluie = await rain();
    document.getElementById('rain-big-icon').classList.add(pluie.icon);

    if (pluie.text) {
	document.getElementById("p-quand-pluie").innerHTML = (pluie.text);
    } else {
	document.getElementById("col-quand-pluie").classList.add("d-none");
    }
	
    document.getElementById("butt-eheh").onclick = () => {
	try {
	    navigator.geolocation.getCurrentPosition(async (position) => {
		let lat, lon;
		lat = position.coords.latitude;
		lon = position.coords.longitude;

		document.body.append(lat + ' ' + lon + '<br />');

		document.getElementById('card-rain').classList.add("border-info");

		let pluie = await rain(lat,lon);
		document.getElementById('rain-big-icon').classList.add(pluie.icon);
		
		if (pluie.text) {
		    document.getElementById("col-quand-pluie").classList.remove("d-none");
		    document.getElementById("p-quand-pluie").innerHTML = pluie.text;
		} else {
		    document.getElementById("col-quand-pluie").classList.add("d-none");
		}
	    });
	} catch (err) {
	    document.body.append(err + '<br />');
	}
    };
}

main();
// velib: 11019, 11111
