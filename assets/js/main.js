var fs = require('fs');
var n_p_file = "name-password.txt"



function getCet46 (kh, xm) {
  var http = require('http')
  xm = encodeURIComponent(xm);
  var q_path = '/cet/query?zkzh=' + kh + '&xm=' + xm;

  var options = {
    hostname: 'www.chsi.com.cn',
    port: 80,
    path: q_path,
    method: 'GET',
    headers: {'Referer':'http://www.chsi.com.cn/cet/'}
  };


  http.get(options, function(res) {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {

      var reg = /<table.+class=\"cetTable\"[\s\S]+<\/table>/
      str = body.match(reg)

      if (!fs.existsSync("user-cached")){
        fs.mkdir("user-cached")
      }
      fs.writeFileSync("user-cached/"+kh+".html", str);

      $("center").append(str);

      $("center").append('<button id="back" class="btn btn-primary"> 返 回 </button>')
      $("#back").bind("click",function(){
        back();
      });

    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });


}



function getCached(file) {
  if (fs.existsSync(file)){

    data = fs.readFileSync(file, 'utf8');
    return data;

  } else{
      return "";
  };

}


function showCached(str) {
  if (str.length > 10) {
    $(".left-panel").append('<h4>已保存的用户</h4>');
    arr = str.split(";");
    $('.left-panel').append('<table class="table table-hover"></table>');
    /*MAYBE I THINK arr.length - 2 because `name-password.txt` last-line also has a ';' */
    $('.table-hover').append('<tbody class="left-table"></tbody>')
    for (var i = arr.length - 2; i >= 0; i--) {
      line = arr[i].split(",");
      $('.left-table').append('<tr>\
                                <td class="user-kh">'+line[0]+'</td>\
                                <td class="user-xm">'+line[1]+'</td>\
      <td><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></td>\
                               </tr>');


    };


    $("tr").click(function(){
      var kh = $(this).children('.user-kh').text();
      var xm = $(this).children('.user-xm').text();
      $("#kh").val(kh);
      $("#xm").val(xm);
    });

    $(".close").click(function() {
      var d_kh = $(this).parent().parent().children('.user-kh').text();
      $(this).parent().parent().remove()
      str = getCached(n_p_file)
      arr = str.split(";")
      for (var i = 0; i < arr.length; i++) {
        line = arr[i].split(",")
        if (line[0] === d_kh) {
          delete arr[i];
        }
      };
      var new_arr = []
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined ) {
          new_arr.push(arr[i]);
        };
      };

      str = new_arr.join(";");
      fs.writeFileSync(n_p_file, str);

    })
  }
}


function changeQueryBtn (trans) {
  if (trans == 'doing') {
    $("#submit").text("正在查询...");
    $("#submit").css("background-color","#79B879");
  } else {
    $("#submit").text(" 查 询 ");
    $("#submit").css("background-color","#5cb85c");
  };
}


function updateCachedList() {
  data = fs.readFileSync(n_p_file, 'utf8');
  length_file = data.split(";").length - 1
  length_node = $('.left-table').children().length

  if (length_file === length_node) {
    console.log("====")
    return
  }else if (length_file - length_node === 1) {
    console.log("!!!====")
    //length_file - 1 => 如果有一个元素，那么length为1，而该元素下标为0
    line = data.split(";")[length_file - 1]
    console.log(line)
    line = line.split(",")
    if ($('.left-table').length === 0) {
      $(".left-panel").append('<h4>已保存的用户</h4>');
      $('.left-panel').append('<table class="table table-hover"></table>');
      $('.table-hover').append('<tbody class="left-table"></tbody>')
    };
    


    $('.left-table').append('<tr>\
                                <td class="user-kh">'+line[0]+'</td>\
                                <td class="user-xm">'+line[1]+'</td>\
        <td><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></td>\
                               </tr>');
  };

}

function back() {
  $(".cetTable").remove();
  $("#back").remove();
  $("body").css("background-color","white");
  $("queryform").show();
  $(".left-panel").show();
  updateCachedList();
  

}

function writeCacheControll (file, str_line, web_response) {
  if (!fs.existsSync(file)){
    fs.writeFileSync(file, str_line);
    return;
  };

  data = fs.readFileSync(file, 'utf8');
  if (data.length < 15) {
    fs.writeFileSync(file, str_line);
    return;
  };

  arr = data.split(";")
  for (var i = 0; i < arr.length - 1; i++) {
    if (arr[i].split(",")[0] == str_line.split(",")[0]){
      return;
    }
  };

  fs.appendFileSync(file, str_line)

}



