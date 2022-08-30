# Feriados Perú API
Se realiza un web scraping a ```https://www.gob.pe/feriados``` para obtener los feriados aprobados por el gobierno 
en Perú. Con esta info se crea un servicio que permita consumir dicha info.

## ```/api/holiday/:date``` 
### Forma de invocar:
```/api/holiday/2022-08-29```
### Salida:
```
{
    success: "error"|"ok", 
    value?: {
        date: string,
        partial_date: string,
        month: string,
        motive: string,
        kind: "public sector" | "all sectors" 
    }
}
```

## ```/api/all```
### Forma de invocar:
```/api/all```
### Salida:
```
{
    success: "error"|"ok", 
    value: [{
        date: string,
        partial_date: string,
        month: string,
        motive: string,
        kind: "public sector" | "all sectors" 
    },...] | []
}
```


