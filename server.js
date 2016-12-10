var http = require('http')
    , fs   = require('fs')
    , url  = require('url')
    , port = 8080
    , data = JSON.parse(fs.readFileSync('data.json'))
    , asc = true
    , qs = require('querystring')
    , pastSearch = ''
    , sizeAnalytics = getAnalytics('Size')
    , orbitalPeriodAnalytics = getAnalytics('Orbital Period')
    , populationAnalytics = getAnalytics('Population')
    , rotationPeriodAnalytics = getAnalytics('Rotational Period')
    , analyticsType = {}
    , results = data

sort("name")
var server = http.createServer (function (req, res) {
    var uri = url.parse(req.url)

    switch( uri.pathname ) {
        case '/':
            sendIndex(res)
            break
        case '/index.html':
            sendIndex(res)
            break
        case '/css/style.css':
            sendFile(res, 'public/css/style.css', 'text/css', 200)
            break
        case '/js/scripts.js':
            sendFile(res, 'public/js/scripts.js', 'text/javascript', 200)
            break
        case '/tblReq':
            sendTbl(res)
            break
        case '/searchPlanets':
            handleSearch(res, req)
            break
        case '/sort':
            handleSort(res, req)
            break
        case '/displayAnalytics':
            handleAnalytics(res, req)
            break
        case '/favicon.ico':
            sendFile(res, '/favicon.ico', 'image/x-icon', 200)
            break
        default:
            sendFile(res, 'public/404.html', 'text/html', 404)
    }

})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

function sendIndex(res) {
    var contentType = 'text/html'
        , html = createHTML()

    res.writeHead(200, {'Content-type': contentType})
    res.end(html, 'utf-8')
}

function sendTbl(res){
    var contentType = 'text/html'
        , html = createTable('')

    res.writeHead(200, {'Content-type': contentType})
    res.end(html, 'utf-8')
}

function createHTML() {
    html = ' '
    html = html + '<html>'
    html = html + '<head>'
    html = html + '<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">'
    html = html + '<link rel="icon" href="/favicon.ico" type="image/x-icon">'
    html = html + '<link rel="stylesheet" type="text/css" href="css/style.css"/>'
    html = html + '<link href="https://fonts.googleapis.com/css?family=Itim" rel="stylesheet">'
    html = html + '<script src="https://use.fontawesome.com/53f66de2be.js"></script>'
    html = html + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>'
    html = html + '<script src="js/scripts.js"></script>'
    html = html + '<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>'

    html = html + '</head>'

    html = html + '<body>'
    html = html + '<div id="header_area">'
    html = html + '<h1>Star Wars Planets</h1>'
    html = html + '<div>A Data Visualization by: Bryan Benson and Brian Rubenstein</div>'
    html = html + '</div>'
    html = html + '<div id="content_area">'
    html = html + '<form action="search" method="search" onsubmit="return false;">'
    html = html + '<input type="text" id="search_planets" placeholder="Search Planets by Name" name="search" />'
    html = html + '<button id="search_btn" type="submit"  onclick="searchPlanets();"><i class="fa fa-search fa-lg fw"></i></button>'
    html = html + '<table id="table">'
    html = html + createTable('')
    html = html + '</table>'
    html = html + '<div id="analytics"><button class="tbl-return" onclick="displayTable()">Return to Table</button> <div id="chart_div"></div></div>'
    html = html + '</div>'
    html = html + '</body>'
    html = html + '</html>'
    return html
}

function createTable(filterString) {
    html = ''
    html = html + '<tr>'
    html = html + '<th><button id="name_order" class="table-btn" onclick="sort(0)">Name: <span><i class="fa fa-sort" aria-hidden="true"></i></span></button></th>'
    html = html + '<th><button id="size_order" class="table-btn" onclick="sort(1)">Size (Km):  <span><i class="fa fa-sort" aria-hidden="true"></i></span></button></th>'
    html = html + '<th><button id="op_order" class="table-btn" onclick="sort(2)">Orbital Period (Days):  <span><i class="fa fa-sort" aria-hidden="true"></i></span></button></th>'
    html = html + '<th><button id="climate_order" class="table-btn" onclick="sort(3)">Climate:  <span><i class="fa fa-sort" aria-hidden="true"></i></span></button></th>'
    html = html + '<th><button id="terrain_order" class="table-btn" onclick="sort(4)">Terrain:  <span><i class="fa fa-sort" aria-hidden="true"></i></span></button></th>'
    html = html + '<th><button id="pop_order" class="table-btn" onclick="sort(5)">Population:  <span><i class="fa fa-sort" aria-hidden="true"></i></span></button></th>'
    html = html + '<th><button id="rp_order" class="table-btn" onclick="sort(6)">Rotational Period (Hours): <span><i class="fa fa-sort" aria-hidden="true"></i></span></button></th>'
    html = html + '</tr>'
    html = html + '<tr>'
    html = html + '<th></th>'
    html = html + '<th><button onclick="displayAnalytics(1)"  class="analytics-btn"  >Analyze</button></th>'
    html = html + '<th><button onclick="displayAnalytics(2)"   class="analytics-btn"   >Analyze</button></th>'
    html = html + '<th></th>'
    html = html + '<th></th>'
    html = html + '<th><button onclick="displayAnalytics(5)"  class="analytics-btn"   >Analyze</button></th>'
    html = html + '<th><button onclick="displayAnalytics(6)"   class="analytics-btn"   >Analyze</button></th>'
    html = html + '</tr>'
    for (var i = 0; i < results.planets.length; i++) {
        html = html + '<tr>'
        html = html + '<td>' + results.planets[i].name + '</td>'
        html = html + '<td>' + results.planets[i].size + '</td>'
        html = html + '<td>' + results.planets[i].orbital_period + '</td>'
        html = html + '<td>' + results.planets[i].climate + '</td>'
        html = html + '<td>' + results.planets[i].terrain + '</td>'
        html = html + '<td>' + results.planets[i].population + '</td>'
        html = html + '<td>' + results.planets[i].rotation_period + '</td>'
        html = html + '</tr>'
    }
    return html
}

function sendFile(res, filename, type, code) {
    fs.readFile(filename, function(error, content) {
        res.writeHead(code, {'Content-type': type})
        res.end(content, 'utf-8')
    })
}

function handleSort(res, req){
    var chunk = ""
    req.on('data', function(reqData) {
        chunk += reqData;
    })
    req.on('end', function(reqData) {
        // Note: this is not a great way to access this object.
        var q = qs.parse(chunk)
        var prop = q.sortBy;
        sort(prop);
        res.end('testing return');
    })
}

function handleAnalytics(res, req){
    var chunk = ""
    req.on('data', function(reqData) {
        chunk += reqData;
    })
    req.on('end', function(reqData) {
        // Note: this is not a great way to access this object.
        var q = qs.parse(chunk)
        var prop = q.type;
        sendAnalytics(prop, res, req);
        res.end('testing return');
    })
}

function handleSearch(res, req) {
  var body = ''
  req.on('data', function(d) {
    body += d;
  })
  req.on('end', function(d) {
    var post = qs.parse( body )
      if (post.search) {
          results = []
          for (var planet of data.planets) {
              if (planet.name.toLowerCase().indexOf(post.search.toLowerCase()) !== -1) {
                  results.push(planet);
              };
          }
          results = { "planets": results }
      }
      else {
          results = data
      }
    res.end('testing return');
  })
}

function sort(prop){
    if(prop == pastSearch){
        asc = !asc
    } else {
        asc = true;
    }
    var unknowns = []
    var knowns = []
    for (var i = 0; i < results.planets.length; i++){
        if(results.planets[i][prop] == "Unknown"){
            unknowns.push(results.planets[i]);
        } else {
            knowns.push(results.planets[i]);
        }
    }
    knowns = knowns.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    knowns = knowns.concat(unknowns);
    results.planets = knowns;
    pastSearch = prop
}

function getAnalytics(type) {
  results = []
  results.push(['Name', type])

  for (var planet of data.planets) {
    if (type == 'Size') {
      if (planet.size != "Unknown") {
        results.push([planet.name, planet.size])
      }
    }
    else if (type == 'Orbital Period') {
      if (planet.orbital_period != "Unknown") {
        results.push([planet.name, planet.orbital_period])
      }
    }
    else if (type == 'Population') {
      if (planet.population != "Unknown") {
        results.push([planet.name, planet.population])
      }
    }
    else {
      if (planet.rotation_period != "Unknown") {
        results.push([planet.name, planet.rotation_period])
      }
    }
  }
  return results
}

function sendAnalytics (type, res, req) {
  if (type == "size") {
    analyticsType = { 'analytics': sizeAnalytics }
  }
  else if (type == "orbital_period") {
    analyticsType = { 'analytics': orbitalPeriodAnalytics }
  }
  else if (type == "population") {
    analyticsType = { 'analytics':  populationAnalytics }
  }
  else {
    analyticsType = { 'analytics':  rotationPeriodAnalytics }
  }
  res.writeHead(200, {'Content-type': 'text/plain'})
  res.end(JSON.stringify(analyticsType), 'utf-8')
}

