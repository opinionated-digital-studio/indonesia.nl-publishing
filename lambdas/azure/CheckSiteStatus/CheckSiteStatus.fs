namespace Opinionated.KbriDenHaag.CheckSiteStatus

open System
open System.IO
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open Microsoft.Azure.WebJobs
open Microsoft.Azure.WebJobs.Extensions.Http
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.Logging
open Newtonsoft.Json
open FSharp.Data

module CheckSiteStatus =

    type SiteStatus =
        | Live
        | Down

    let siteStatusToString (siteStatus: SiteStatus) =
        match siteStatus with
            | Live -> "Live"
            | Down -> "Down"
    
    let private siteUrl = "https://indonesia.nl"

    let private isLive () = 
        try
            (HtmlDocument.Load siteUrl).CssSelect("h1.kbrinl-heading-xl")
            |> List.exists(fun node -> node.InnerText () = "Apa yang bisa kami bantu?")
        with
            | _ -> false

    let getStatus () =
        if isLive () = true then
            Live
        else
            Down

    [<FunctionName("CheckSiteStatus")>]
    let run([<HttpTrigger(AuthorizationLevel.Function, "get", Route = null)>]req: HttpRequest, log: ILogger) =
        log.LogInformation("Started")
        getStatus ()
            |> siteStatusToString
            |> fun result -> new OkObjectResult(result)
