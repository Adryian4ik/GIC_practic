
import {HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor (private http: HttpClient){

    }

    private host = "http://127.0.0.1:8000";

    addTask(name:string, lat: number | null, lng: number| null, date: Date){
        return this.http.post(`${this.host}/task`,{
            "date": date.getTime() / 1000,
            "lat": lat,
            "long": lng,
            "name": name
        });
    }

    getTaskList(actual: boolean){
        return this.http.get(`${this.host}/tasks?actual=${actual}`);
    }


    changeActual(taskId: string, actual: boolean){
        return this.http.patch(`${this.host}/task?task_id=${taskId}&actual=${actual}`, {});

    }

    getDescription(taskId: string){
        return this.http.get(`${this.host}/descriptions?task_id=${taskId}`);
    }


    addDescription(text: string, taskId: string){
        return this.http.post(`${this.host}/description`, {
            "task_id": taskId,
            "text": text
        });
    }

}