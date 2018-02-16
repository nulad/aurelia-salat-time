import { geoService } from './geo-service';
import { HttpClient } from 'aurelia-fetch-client';
import minurl from 'min-url';

export class praytime {
    constructor() {
        this.heading = "Prayer time based from your location.";
        this.getCoordinates().then((coordinate) => {
            let client = new HttpClient();

            client.configure(config => {
                config
                    .useStandardConfiguration()
                    .withDefaults({
                        headers: {
                            'referer': 'salat-time-test'
                        }
                    });
            });

            console.log(this.composeUrl(coordinate));

            client.fetch(this.composeUrl(coordinate))
                .then(response => response.json())
                .then(data => {
                    this.message = data.display_name;
                });
        });
    }

    getCoordinates() {
        return geoService.locate().then((position) => {
            return position.coords;
        }, () => {
            return 'no geo';
        });
    }


    composeUrl(coordinate) {
        let urlObject = minurl.parse('https://nominatim.openstreetmap.org/reverse?format=json&zoom=15&addressdetails=1', true);

        urlObject.query.lat = coordinate.latitude;
        urlObject.query.lon = coordinate.longitude;

        return minurl.format(urlObject);
    }

}