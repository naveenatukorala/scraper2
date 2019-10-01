var Viewer=function(){};Viewer.prototype.data=bit155.attr({callback:function(a){this.reload()}});Viewer.prototype.tabId=bit155.attr({filter:function(a){return parseInt(a,10)}});
Viewer.prototype.reloadPresets=function(){var a,b=this,d=bit155.scraper.presets();a=$("#presets-list");a.empty();$.each(d||[],function(e,c){var g=$('<img class="preset-handle" src="img/application-form.png">'),f=$('<a class="preset-load" href="javascript:;" title="Load this preset.">').text(c.name).click(function(){b.options(c.options);$("#presets-form-name").val(c.name);$("#presets").dialog("close");b.scrape();return!1}),h=$('<a class="preset-remove" href="javascript:;" title="Remove this preset.">').append($('<img src="img/bullet_delete.png" title="Remove preset.">')).click(function(){confirm('Are you sure you want to remove the preset, "'+
c.name+'"?')&&(d.splice(e,1),bit155.scraper.presets(d),b.reloadPresets())});a.append($("<li>").attr("id","preset-"+e).append(g).append(h).append(f))})};
Viewer.prototype.options=function(a){if(a){var b=this;$("#options-selector").val(a.selector).change();$("#options-language").val(a.language).change();$.isArray(a.attributes)&&0<a.attributes.length?($("#options-attributes tbody").empty(),$.each(a.attributes,function(){b.addAttribute(this.xpath,this.name)})):b.addAttribute(".","Text");$("#options-filters").find("input:checkbox").attr("checked",!1);$.isArray(a.filters)&&0<a.filters.length&&$.each(a.filters,function(a,b){"empty"===b&&$("#options-filters-empty").attr("checked",
!0)});return this}return $("#options").serializeParams()};
Viewer.prototype.addAttribute=function(a,b,d){var e=this,c=$("<input>").attr("type","text").attr("name","attributes[][xpath]").attr("placeholder","XPath").val(a||""),g=$("<input>").attr("type","text").attr("name","attributes[][name]").attr("placeholder","Name (optional)").val(b||""),f=$("<tr>");f.append($("<td nowrap>").addClass("dragHandle").text(" "));f.append($("<td>").append(c));f.append($("<td>").append(g));f.append($("<td nowrap>").append($("<a>").attr("href","javascript:;").click(function(){1<
f.parent().children().length?f.fadeOut("fast",function(){f.remove()}):(c.val(""),g.val(""));return!1}).html('<img src="img/bullet_delete.png">')).append($("<a>").attr("href","javascript:;").click(function(){e.addAttribute("","",f);return!1}).html('<img src="img/bullet_add.png">')));f.hide();a=function(){$("#options-attributes").tableDnD({dragHandle:"dragHandle"})};d?d.after(f.fadeIn("fast",a)):$("#options-attributes tbody").append(f.fadeIn("fast",a))};
Viewer.prototype.error=function(a){$('<div class="error">').text(a.message?a.message:""+a).dialog({title:"Error",modal:!0,buttons:[{text:"Close",click:function(){$(this).dialog("close")}}]})};
Viewer.prototype.reload=function(){var a=this,b=this.data(),d=b.result||[],e=b.attributes||[],b=$("<thead>"),c=$("<tr>").appendTo(b).append("<th>&nbsp;</th>").append("<th>&nbsp;</th>");$.each(e,function(){c.append($("<th>").text(this.name))});var g=$("<tbody>");$.each(d,function(b,d){var c=$("<tr>").appendTo(g);$('<td class="tools" nowrap>').appendTo(c).append($('<img src="img/highlighter-small.png" title="Highlight in document.">').click(function(){chrome.tabs.sendRequest(a.tabId(),{command:"scraperHighlight",
payload:{xpath:d.xpath}})}));c.append($('<td class="index" nowrap>').text(b+1));$.each(e,function(a,b){var h=d.values[a],h=$("<td>").text(h);c.append(h)})});var f=/^https?:\/\/[^\s]+$/i;$("<table>").append(b).append(g).appendTo($("#results-table").empty()).dataTable({bInfo:!1,bFilter:!1,bStateSave:!0,bPaginate:!1,fnRowCallback:function(a,b,d,c){$("td",a).each(function(){var a=$(this).text();f.test(a)&&$(this).empty().append($("<a>").attr("href",a).attr("target","_blank").text(a))});return a},aoColumnDefs:[{aTargets:[0],
bSortable:!1}]})};Viewer.prototype.scrape=function(){var a=this,b=a.options();b.attributes=$.map(b.attributes.filter(function(a){return""!==a.xpath}),function(a){a.name||(a.name=a.xpath);return a});b={command:"scraperScrapeTab",payload:{tab:a.tabId(),options:b}};chrome.extension.sendRequest(b,function(b){b.error&&a.error(b.error);a.data(b)})};
Viewer.prototype.buildExportData=function(a){var b=[];a||(a=function(a){return a});b.push($.map(this.data().attributes||[],function(a){return a.name||a.xpath}));$.each(this.data().result||[],function(d,e){b.push(e.values.map(a))});return b};Viewer.prototype.buildCSV=function(){return bit155.csv.csv(this.buildExportData())};
Viewer.prototype.buildTSV=function(){var a=/[\t\n]/g;return bit155.csv.csv(this.buildExportData(function(b){if("string"===typeof b)for(;b.match(a);)b=b.replace(a," ");return b}),"\t")};
Viewer.prototype.exportClipboard=function(){var a={command:"scraperExportClipboard",payload:{body:this.buildTSV()}};chrome.extension.sendRequest(a,function(a){var d=$("<div>");d.html("<p>Your data has been copied to the clipboard.</p>");d.dialog({closeOnEscape:!0,buttons:[],resizable:!1,title:"Copy to clipboard",modal:!0,hide:"fade"});window.setTimeout(function(){d.dialog("close")},1E3)})};
Viewer.prototype.exportSpreadsheet=function(){
    var a=this,
    b=this.buildCSV();
    chrome.tabs.get(
        a.tabId(),
        function(d){
            var e={},
            c=$("<div>").addClass("progress");
            d=d.title;
            c.append($('<div style="margin: 30px; text-align: center"><img src="img/progress.gif"></div>'));
            c.dialog({closeOnEscape:!0,buttons:[],resizable:!1,title:"Exporting to Google Drive...",modal:!0});
            e.command="scraperSpreadsheet";
            e.payload={title:d,csv:b};
            chrome.extension.sendRequest(e,function(b){
                c.dialog("close");b.error&&a.error(b.error)})})};

                Viewer.prototype.exportAws = function() {

                    var a = this, 
                    b = this.buildCSV(); 
                        chrome.tabs.get(
                            a.tabId(), 
                            function(){
                    
                                
                    var s3 = new AWS.S3();
                    var params = {
                        Bucket: bucketName,
                        Key: filePath,
                        Body: csvFileContent,
                        ContentType: 'application/octet-stream',
                        ContentDisposition: contentDisposition (filePath, {
                            type: 'inline'
                        }),
                        CacheControl: '' 
                    }
                    
                    s3.putObject(params, function(err, data) {
                        if (err) {
                            console.log("Error at uploadCSVFileOnS3Bucket function", err);
                            next(err);
                        } else {
                            console.log("File uploaded Successfully");
                            next(null, filePath);
                        }
                    })
                    
                    var c = $("<div>").addClass("progress"); 
                    c.append($('<div style="margin: 30px; text-align: center"><img src="img/progress.gif"></div>')); 
                    c.dialog({ 
                                closeOnEscape: !0, 
                                buttons: [], 
                                resizable: !1, 
                                title: "Exporting to AWS...", 
                                modal: !0 
                               }); 
                            
                    chrome.extension.sendRequest((s3.putObject), function (b) { 
                            c.dialog("close"); 
                            b.error && a.error(b.error) })  })};
                

function parseQueryString(a){var b={};void 0==a&&(a=location.search?location.search:"");"?"==a.charAt(0)&&(a=a.substring(1));a=a.replace(/\+/g," ");a=a.split(/[&;]/g);for(var d=0;d<a.length;d++){var e=a[d].split("="),c=decodeURIComponent(e[0]),g=decodeURIComponent(e[1]);b[c]||(b[c]=[]);b[c].push(1==e.length?"":g)}return b}
$(function(){var a=parseQueryString(),b=a.options&&0<a.options.length?JSON.parse(a.options[0]):{},d=JSON.parse(localStorage["viewer.options"]||JSON.stringify({selector:"a",language:"jquery",attributes:[{xpath:".",name:"Link"},{xpath:"@href",name:"URL"}],filters:["empty"]})),e=$.extend({},d,b),c=new Viewer;c.tabId(a.tab&&0<a.tab.length?parseInt(a.tab[0],10):-1);c.options(e);var g=$("body").layout({west:{size:340,minSize:250,closable:!0,resizable:!0,slidable:!0}});localStorage["viewer.west.size"]&&
g.sizePane("west",localStorage["viewer.west.size"]);"true"==localStorage["viewer.west.closed"]&&g.close("west");$("#bottom").accordion({collapsible:!0,active:!1,autoHeight:!1,animated:!1});$("#center").tabs();$("#options").submit(function(){c.scrape();return!1});$("#export-spreadsheet").click(function(){c.exportSpreadsheet();return!1});$("#export-clipboard").click(function(){c.exportClipboard();return!1});$("#export-aws").click(function(){c.exportAws();return!1});chrome.tabs.onRemoved.addListener(function(a){a==c.tabId()&&window.close()});var f=function(a){document.title=
"Scraper - "+a.title;$("#options-meta-page").empty().append($("<a>").attr("href",a.url).text(a.title).click(function(){chrome.tabs.update(c.tabId(),{selected:!0});return!1}));g.resizeContent("west")};chrome.tabs.get(c.tabId(),f);chrome.tabs.onUpdated.addListener(function(a,b,d){a===c.tabId()&&f(d)});$("#about").dialog({autoOpen:!1,draggable:!1,resizable:!1,title:"About",width:400,show:"fade",hide:"fade",modal:!0,closeText:"Close",buttons:[{text:"Close",click:function(){$(this).dialog("close")}}]});
$("#about-link").click(function(){$("#about").dialog("open");return!1});$("#presets").dialog({autoOpen:!1,width:Math.max(100,parseInt(JSON.parse(localStorage["viewer.presets.width"]||"400"),10)),height:Math.max(100,parseInt(JSON.parse(localStorage["viewer.presets.height"]||"300"),10)),position:JSON.parse(localStorage["viewer.presets.position"]||'"center"'),modal:!0,title:"Presets",beforeClose:function(){var a=$(this).dialog("option","position");localStorage["viewer.presets.position"]=JSON.stringify([a[0],
a[1]]);localStorage["viewer.presets.width"]=$(this).dialog("option","width");localStorage["viewer.presets.height"]=$(this).dialog("option","height")}});$("#options-presets-button").click(function(){$("#presets").dialog("open");return!1});$("#presets-form").submit(function(){var a={},b=bit155.scraper.presets(),d=$(this).serializeParams(),e=c.options(),f;if(""===$.trim(d.name||""))return c.error("You must specify a name for the preset."),!1;for(f=0;f<b.length;f++)if(b[f].name===d.name&&!confirm('There is already a preset with the name "'+
d.name+'". Do you want to overwrite the existing preset?'))return!1;a.name=d.name;a.options={};a.options.language=e.language;a.options.selector=e.selector;a.options.attributes=$.extend(!0,[],e.attributes);a.options.filters=$.extend(!0,[],e.filters);b=b.filter(function(b){return b.name!==a.name});b.unshift(a);bit155.scraper.presets(b);c.reloadPresets();return!1});$("#presets-list").sortable({update:function(a,b){var d={},e=[];$.each(bit155.scraper.presets(),function(a,b){d["preset-"+a]=b});$.each($(this).sortable("toArray"),
function(a,b){e.push(d[b])});bit155.scraper.presets(e);c.reloadPresets()}});c.reloadPresets();$("#options-reset-button").click(function(){confirm("Do you want to reset the options to their original values?")&&($("#presets-form-name").val(""),c.options(e),c.scrape());return!1});$("#options-language").change(function(){var a=$("#options-language").val();$("#options-language-help").empty();"jquery"===a?$("#options-language-help").append($('<a href="http://api.jquery.com/category/selectors/" target="_blank">').text("jQuery Reference")):
"xpath"===a&&$("#options-language-help").append($('<a href="http://www.stylusstudio.com/docs/v62/d_xpath15.html" target="_blank">').text("XPath Reference"))});$("#options-language").change();c.scrape();addEventListener("resize",function(a){localStorage["viewer.width"]=window.outerWidth;localStorage["viewer.height"]=window.outerHeight});addEventListener("unload",function(a){a=c.options();a.filters||(a.filters=[]);localStorage["viewer.options"]=JSON.stringify(a);localStorage["viewer.west.size"]=g.state.west.size;
localStorage["viewer.west.closed"]=g.state.west.isClosed},!0);$("#options-selector").select().focus();setTimeout(function(){g.resizeAll()},100);e.error&&setTimeout(function(){c.error(e.error)},500)});
