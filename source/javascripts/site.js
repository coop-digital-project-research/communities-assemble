// This is where it all goes :)

$(document).ready(function(){
  $('#response').hide();
  $("#questions button").click(function(){
    $('#response').show();
    $('#questions').hide();
  });
  $("#response button").click(function(){
    $('#response').hide();
    $('#questions').show();
  });

  $("#questions input").change(function(){
    calculateScores();
  });

  function calculateScores(){
    var scores = {};
    $('fieldset input:checked').each(function(){
      var checked_input = $(this);
      var score = parseInt(checked_input.val());
      var dimension = checked_input.parents('fieldset').data('dimension');
      if(!scores[dimension]){
        scores[dimension] = [];
      }
      scores[dimension].push(score);
    });
    $('#response li').each(function(){
      var score_holder = $(this);
      var final_scores = scores[score_holder.data('dimension')];
      if(!final_scores || final_scores == []){
        score_holder.find('.score').html(0);
      }else{
        score_holder.find('.score').html(math.mean(final_scores));
      }
    });
  }

});
