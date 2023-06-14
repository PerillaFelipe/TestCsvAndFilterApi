'use strict';

import { Request, Response } from 'express';
import fetch from 'cross-fetch';

function filterDataApiRecruit(req: Request, res: Response): void { 
  res.writeHead(200, { 'content-Type': 'text/html' });

  // validate the request
  if (req.params.date && req.query.dias) {
   
    const api = 'https://apirecruit-gjvkhl2c6a-uc.a.run.app/compras/'

    const dateSplited = req.params.date.split('-')
    let monthQuery = Number( dateSplited[1] ) - 1
    const dayDate = dateSplited[2]
    const dayQuery = req.query.dias
    const validateDaysMonth = Number(dayDate) + Number(dayQuery) - 1

    // Validate the final day of the month
    const monthsWithFinalDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const dayFinalMonth = monthsWithFinalDay[monthQuery]
    console.log('dayFinalMonth',)

    if (validateDaysMonth && validateDaysMonth <= dayFinalMonth) {

      let urls:string[] = [];

      const days = Number(dayQuery);
      for (let i=0; i < days; i++) {
        let dayUpdated = Number(dayDate)+i
        let dayUpdatedToString = dayUpdated.toString()
        dayUpdatedToString = dayUpdated < 10 ? `0${dayUpdatedToString}` : dayUpdatedToString
        const dateToQuery = `${dateSplited[0]}-${dateSplited[1]}-${dayUpdatedToString}`
        const apiToQuery = api+dateToQuery
        urls.push(apiToQuery)
      }
      
      let response = {
        total: 0,
        comprasPorTDC: {
          oro: 0,
          amex: 0
        },
        noCompraron: 0,
        compraMasAlta: 0
      } 
      Promise.all(urls.map(url => fetch(url)))
      .then(resp => Promise.all( resp.map(r => r.json()) ))
      .then(results => {
        let totalRows = 0
        let tdcOro = 0
        let tdcAmex = 0
        let noCompraron = 0
        let compraMasAlta:number[] = []

        results.forEach(resultCalledApi => {
          totalRows = totalRows + resultCalledApi.length
          const numberOfTdcOro = resultCalledApi.filter(row => row.tdc === "visa gold")
          const numberOfTdcAmex = resultCalledApi.filter(row => row.tdc === "amex")
          tdcOro = tdcOro + numberOfTdcOro.length
          tdcAmex = tdcAmex + numberOfTdcAmex.length
          resultCalledApi.forEach(row => row.compro == false && noCompraron++)
          const amounts = resultCalledApi.map(row => row.monto ? row.monto : 0)
          let maxAmount = Math.max(...amounts)
          compraMasAlta.push(maxAmount)
        })
        response.total = totalRows
        response.comprasPorTDC.oro = tdcOro
        response.comprasPorTDC.amex = tdcAmex
        response.noCompraron = noCompraron
        response.compraMasAlta = Math.max(...compraMasAlta)

        console.log(JSON.stringify(response))
        res.write(`<div>response ${JSON.stringify(response) }</div>`);
        res.end()
        return
      });
    } else {
      res.write(`<div>Debes buscar hasta utlimo dia vigente de este mes, cambia a:${JSON.stringify(req.query.dias) }</div>`);
      res.end()
    }
  }
}

export { filterDataApiRecruit }
