export class Storage{
    static isSupported():boolean{
        if (typeof localStorage === "undefined") {
            alert("Sorry! Your Browser Don't Support Web Storage. ");
            return false;
          }
          return true;
    }

    static addItem(item:any , key:string){
        if(this.isSupported()){
            return localStorage.setItem(key,JSON.stringify(item))
        }
    }

    static getItem(key:string){
        return JSON.parse(localStorage.getItem(key)!);
    }
}