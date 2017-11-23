// This is where it all goes :)

$(document).ready(function(){
  var question_json = $('#questions').data('json');

  $('#response').hide();
  $("#questions button").click(function(){
    calculateScores();
    $('#response').show();
    $('#questions').hide();
  });
  $("#response button").click(function(){
    $('#myChart').html('');
    $('#response').hide();
    $('#questions').show();
  });

  function calculateScores(){
    var scores = {};

    $.each(question_json.dimensions, function(){
      scores[this] = [];
    });

    $('fieldset input:checked').each(function(){
      var checked_input = $(this);
      var score = parseInt(checked_input.val());
      var dimension = checked_input.parents('fieldset').data('dimension');
      scores[dimension].push(score);
    });

    var averaged_dimensions = {};
    $.each(question_json.dimensions, function(){
      var final_scores = scores[this];
      if(!final_scores || final_scores.length == 0){
        averaged_dimensions[this] = 0;
      }else{
        averaged_dimensions[this] = math.mean(final_scores);
      }
    });

    $.each(question_json.dimensions, function(){
      var final_score = averaged_dimensions[this];
      var paragraph = $("#" + this + "_reflection");
      if (final_score < -1 ) {
        paragraph.html(question_json.reflections[this].low);
      } else if (final_score < 1 ) {
        paragraph.html(question_json.reflections[this].medium);
      } else {
        paragraph.html(question_json.reflections[this].high);
      }
    });

    $.each(averaged_dimensions, function() {

    });

    var ctx = document.getElementById("myChart");
    var myRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(averaged_dimensions),
        datasets: [{data: Object.values(averaged_dimensions)}]
      }
    });
  }

});
