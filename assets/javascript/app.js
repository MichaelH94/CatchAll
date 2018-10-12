var artistResult = ["", "", ""];
var artistResultImage = ["", "", ""];
var artistResultLastFM = ["", "", ""];
var artistTopDiscogs = ["", "", ""];
var artistTags = ["", "", ""];

$(document).ready(function() {

var config = {
   apiKey: "AIzaSyDgZnzLX0LLIVRKIPRnQZGxASVr-0g5-A4",
   authDomain: "kuproject1-2bd9a.firebaseapp.com",
   databaseURL: "https://kuproject1-2bd9a.firebaseio.com",
   projectId: "kuproject1-2bd9a",
   storageBucket: "kuproject1-2bd9a.appspot.com",
   messagingSenderId: "641399126415"
  };

 firebase.initializeApp(config);
 
 var db = firebase.database();

 db.ref().startAt().limitToLast(5).on("child_added", function(snapshot) {
    var recentSearch = snapshot.val().search;
    var recentURL = snapshot.val().url;
    recentSearch = toTitleCase(recentSearch);
    $('#recentSearches').append('<a class="animated flash" href="" id="recent">' + recentSearch + "</a><br>");

 });

function extraLargeImage(element) {
    return element.size === 'extralarge';
}


 $("#submitbtn").click(function(e) {
    e.preventDefault();
    $("#displayResults").empty();
    var artist = $("#searchForm").val();
    var artistSearch = artist.split(' ').join('+');
    artistSearch = artistSearch.replace(/[\/\\#,()~%.'":*?<>{}]/g, '');
    artistSearch = artistSearch.replace("$", "s")
    artistSearch = artistSearch.replace("&", "and")

    var currentURL = "https://last.fm/music/" + artistSearch

    lastFMPull(artistSearch);

    db.ref().push({
        search: artist,
    });  

});

$(document).on("click","#recent", function(e){
    e.preventDefault();
    $("#displayResults").empty();
    var artist = $(this).text();
    var artistSearch = artist.split(' ').join('+');
    artistSearch = artistSearch.replace(/[\/\\#,()~%.'":*?<>{}]/g, '');
    artistSearch = artistSearch.replace("$", "s")
    artistSearch = artistSearch.replace("&", "and")

    lastFMPull(artistSearch);

  });

$(document).on("click", "#searchSuggestion", function(e) {
    e.preventDefault();
    $("#displayResults").empty();
    var artist = $('#artistName').text();
    var artistSearch = artist.split(' ').join('+');
    artistSearch = artistSearch.replace(/[\/\\#,()~%.'":*?<>{}]/g, '');
    // artistSearch = artistSearch.replace("$", "s")
    artistSearch = artistSearch.replace("&", "and")

    db.ref().push({
        search: artist,
    });  
    lastFMPull(artistSearch);
});


function createCard(z) {
    var aNameS = artistResult[z].split(' ').join('+');
        aNameS = aNameS.replace(/[\/\\#,()~%.'":*?<>{}]/g, '');
        aNameS = aNameS.replace("$", "s");
        aNameS = aNameS.replace("&", "and");

        console.log(z, artistResult[z]);
    $("#displayResults").append(
        '<div class="card animated fadeInDownBig">'  +
        '<img class="card-img-top" src="' + artistResultImage[z] +
        '">' + '<div class="card-body">' +
        '<h5 class="card-title" id="modalName' + z +'">' + artistResult[z] +'</h5>' +
        '<a href="' + artistResultLastFM[z] + '" class="card-link">' +
        'Last.fm' + '</a>' + '<br>' +
        '<a href="https://en.wikipedia.org/wiki/Special:Search?search=' + artistResult[z] + '" class="card-link">'
        + 'Wikipedia' + '</a><br><br>' +
        '<button type="button" class="btn btn-secondary btn-sm" id="modalBTN' + z + '"> More Info</button>' +
        '</div>'
    );

}


function lastFMPull(artistSearch) {

    var lastApi = "5ab1615116e0cf8fa1c5270f3ab5310b";
    var lastFMURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistSearch + "&api_key=" + lastApi + "&format=json";

  $.ajax({
    url: lastFMURL,
    method: "GET"
}).done(function(response) {

    for(x = 0; x < 3; x++) {
    var artistName = response.artist.similar.artist[x].name;
    var artistLastFM = response.artist.similar.artist[x].url;
    var artistImage = response.artist.similar.artist[x].image.find(extraLargeImage);
    
    artistImage = artistImage ? artistImage['#text'] : '';
    artistResult[x] = artistName;
    artistResultImage[x] = artistImage;
    artistResultLastFM[x] = artistLastFM;
        }

    }).then(function() {
        for(x = 0; x < 3; x++) {
        createCard(x);
        }
    });
}

    $(document).on("click","#modalBTN0", function(){
        var modalCount = 0; 
        createModal(modalCount);
      });

      $(document).on("click","#modalBTN1", function(){
        var modalCount = 1; 
        createModal(modalCount);
      });

      $(document).on("click","#modalBTN2", function(){
        var modalCount = 2; 
        createModal(modalCount);
      });
 
});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function createModal(z) {
    $('#artistName').text(artistResult[z])
    $('#artistInfo').text('');
    $('#searchSimilar').text('');
    var newSearch = artistResult[z].split(' ').join('+');
    var lastApi = "5ab1615116e0cf8fa1c5270f3ab5310b";
    var lastFMURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + newSearch + "&api_key=" + lastApi + "&format=json";
    
      $.ajax({
        url: lastFMURL,
        method: "GET"
    }).done(function(response) {
        var artistBio = response.artist.bio.summary;

        for(x = 0; x < 3; x++) {
            artistTags[x] = response.artist.tags.tag[x].name;
        }

        $('#artistInfo').append("Artist Bio:" + '<br>' + artistBio)
        $('#artistInfo').append('<br> <br>' + "Top search results on Discogs:" + '<br>')
           

            var discToken = "wbbxBuWRXkskhtSOFJfYlguczHGzXROzjdXySTcI";

            var aResultString = artistResult[z].split(' ').join('+');
                aResultString = aResultString.replace(/[&\/\\#,()~%.'":*?<>{}]/g, '');
                aResultString = aResultString.replace("$", "s");
        
           
                var discURL = "https://api.discogs.com/database/search?q=" + aResultString + "?all&token=" + discToken
        
                $.ajax({
                    url: discURL,
                    method: "GET"
                }).done(function(response) {
            
                for (x = 0; x < 3; x++) {
                    artistTopDiscogs[x] = response.results[x].title;
                    var discogsSearch = artistTopDiscogs[x];
                    discogsSearch = discogsSearch.split(' ').join('+');
                    discogsSearch = discogsSearch.replace(/[&\/\\#,()~%.'":*?<>{}]/g, '');
                    discogsSearch = discogsSearch.replace("$", "s");

                    $('#artistInfo').append('<a href="https://www.discogs.com/search/?q=' + discogsSearch + '&type=release">' + artistTopDiscogs[x] + '<br>');
                }
           
            }).then(function() {
                $('#artistInfo').append('<a href="https://www.discogs.com/search/?q=' + artistResult[z] + '&type=artist"><br>' + "Search for more " + artistResult[z] + ' on Discogs.' + '</a><br><br>');
                $('#artistInfo').append('<div class="container-fluid"> <span class="text-muted" id="tags"> tags: ')
                for (x = 0; x < 3; x++) {
                    $('#tags').append('<a href="https://www.last.fm/tag/' + artistTags[x] + '">' + artistTags[x] + '</a>' + " ");
                    if(x == 2) {
                        $('#tags').append('</span></div><br>')
                    }
                }
                $('#searchSimilar').append('<a href="" data-dismiss="modal" id="searchSuggestion"> Search artists simlar to ' + artistResult[z] + '</a>')
            });

        
    }).then(function() {
        $('#artistModal').modal();
    });
}