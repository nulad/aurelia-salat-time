import {inject} from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import minurl from 'min-url';
import moment from 'moment';
import { geoService } from './geo-service';
import config from './config/salatConfig';

@inject(HttpClient)
export class praytime {
    heading = "Prayer time based from your location.";

    constructor(httpClient) {
        
        httpClient.configure(config => {
            config
                .useStandardConfiguration()
                .withDefaults({
                    headers: {
                        'referer': 'salat-time-test'
                    }
                });
        });

        this.client = httpClient;
    }

    activate() {
        return this.getCoordinates().then((coordinate) => {
            console.log(this.composePrayTimeUrl(coordinate));

            this.client.fetch(this.composeLocationUrl(coordinate))
                .then(response => response.json())
                .then(responseData => {
                    this.message = responseData.display_name;
                });

            this.client.fetch(this.composePrayTimeUrl(coordinate))
            .then(response => response.json())
            .then(responseData => {
                this.timings = responseData.data.timings;
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

    composePrayTimeUrl(coordinate) {
        let unixNow = moment().format('X');
        let urlObject = minurl.parse(config.salatApiUrl + unixNow, true);
        urlObject.query.latitude = coordinate.latitude;
        urlObject.query.longitude = coordinate.longitude;

        return minurl.format(urlObject);
    }

    composeLocationUrl(coordinate) {
        let urlObject = minurl.parse(config.locationApiUrl, true);

        urlObject.query.lat = coordinate.latitude;
        urlObject.query.lon = coordinate.longitude;

        return minurl.format(urlObject);
    }

}