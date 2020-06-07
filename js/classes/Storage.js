export class Storage {
    static isSupported() {
        if (typeof localStorage === "undefined") {
            alert("Sorry! Your Browser Don't Support Web Storage. ");
            return false;
        }
        return true;
    }
    static addItem(item, key) {
        if (this.isSupported()) {
            return localStorage.setItem(key, JSON.stringify(item));
        }
    }
    static getItem(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}
