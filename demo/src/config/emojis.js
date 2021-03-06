const emojis = {
  ':expressionless_face:': '😑',
  ':skull:': '💀',
  ':thinking_face:': '🤔',
  ':grimacing_face:': '😬',
  ':man_shrugging_medium_skin_tone:': '🤷🏽‍♂️',
  ':grinning_face_with_sweat:': '😅',
  ':astonished_face:': '😲',
  ':money_bag:': '💰',
  ':money_mouth_face:': '🤑',
  ':money_with_wings:': '💸',
  ':index_pointing_up_medium_skin_tone:': '☝🏽',
  ':airplane:': '✈',
  ':backhand_index_pointing_right_medium_skin_tone:': '👉🏽',
  ':beaming_face_with_smiling_eyes:': '😁',
  ':broken_heart:': '💔',
  ':cat_with_tears_of_joy:': '😹',
  ':check_mark_button:': '✅',
  ':cherry_blossom:': '🌸',
  ':clapping_hands_medium_skin_tone:': '👏🏽',
  ':collision:': '💥',
  ':crown:': '👑',
  ':crying_face:': '😢',
  ':downcast_face_with_sweat:': '😓',
  ':exclamation_mark:': '❗',
  ':eyes:': '👀',
  ':face_with_tears_of_joy:': '😂',
  ':flexed_biceps_medium_skin_tone:': '💪🏽',
  ':four_leaf_clover:': '🍀',
  ':gem_stone:': '💎',
  ':grinning_face_with_smiling_eyes:': '😄',
  ':grinning_squinting_face:': '😆',
  ':growing_heart:': '💗',
  ':headphone:': '🎧',
  ':heart_suit:': '♥️',
  ':hundred_points:': '💯',
  ':keycap_1:': '1️⃣',
  ':kissing_face_with_closed_eyes:': '😚',
  ':leaf_fluttering_in_wind:': '🍃',
  ':man_walking_medium_skin_tone:': '🚶🏽‍♂️',
  ':microphone:': '🎤',
  ':musical_note:': '🎵',
  ':musical_notes:': '🎶',
  ':neutral_face:': '😐',
  ':ok_hand_medium_skin_tone:': '👌🏽',
  ':palm_tree:': '🌴',
  ':pensive_face:': '😔',
  ':persevering_face:': '😣',
  ':person_raising_hand_medium_skin_tone:': '🙋🏽',
  ':pile_of_poo:': '💩',
  ':pizza:': '🍕',
  ':play_button:': '▶️',
  ':pouting_face:': '😡',
  ':raised_fist_medium_skin_tone:': '✊🏽',
  ':recycling_symbol:': '♻️',
  ':red_heart:': '❤️',
  ':ribbon:': '🎀',
  ':right_arrow:': '➡️',
  ':rose:': '🌹',
  ':sleeping_face:': '😴',
  ':sleepy_face:': '😪',
  ':smiling_cat_with_heart_eyes:': '😻',
  ':smiling_face_with_heart_eyes:': '😍',
  ':smiling_face_with_sunglasses:': '😎',
  ':smirking_face:': '😏',
  ':snowflake:': '❄',
  ':soccer_ball:': '⚽',
  ':sparkling_heart:': '💖',
  ':speak_no_evil_monkey:': '🙊',
  ':squinting_face_with_tongue:': '😝',
  ':star:': '⭐',
  ':sun:': '☀️',
  ':thought_balloon:': '💭',
  ':tired_face:': '😫',
  ':victory_hand_medium_skin_tone:': '✌🏽',
  ':waving_hand_medium_skin_tone:': '👋🏽',
  ':winking_face': '😉',
  ':woman_dancing_medium_skin_tone:': '💃🏽',
  ':worried_face:': '😟',
  ':yellow_heart:': '💛',
};

const entityEmojiNames = [
  ':woman_dancing_medium_skin_tone:',
  ':waving_hand_medium_skin_tone:',
  ':victory_hand_medium_skin_tone:',
  ':sun:',
  ':right_arrow:',
  ':red_heart:',
  ':recycling_symbol:',
  ':raised_fist_medium_skin_tone:',
  ':play_button:',
  ':person_raising_hand_medium_skin_tone:',
  ':ok_hand_medium_skin_tone:',
  ':man_walking_medium_skin_tone:',
  ':keycap_1:',
  ':heart_suit:',
  ':flexed_biceps_medium_skin_tone:',
  ':clapping_hands_medium_skin_tone:',
  ':backhand_index_pointing_right_medium_skin_tone:',
  ':index_pointing_up_medium_skin_tone:',
  ':man_shrugging_medium_skin_tone:',
];

/**
 * Some emojis take more than one keystroke to delete in blocksmith, so they must be given
 * immutable entities. Is there a programmatic way to figure out which? Maybe but i cant figure
 * it out. Emojis are weird dude.
 */
const entityEmojis = Object.entries(emojis).reduce((acc, [name, emoji]) => {
  if (entityEmojiNames.includes(name)) {
    return [emoji, ...acc];
  }
  return acc;
}, []);

export default emojis;
export { entityEmojis };
