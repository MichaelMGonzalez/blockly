var node_types = ["selector_node", "sequence_node", "inverter_node"];
var help_url = "http://robots.gadgetron.build/TAZI/help.html"
// Look into mutators
// https://developers.google.com/blockly/guides/create-custom-blocks/mutators

// A good example implementation can be found in
// blocks/logic.js


Blockly.Blocks['selector_node'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("(?) Selector Node");
    this.appendStatementInput("Children")
        .setCheck(["selector_node", node_types]);
    this.setPreviousStatement(true, node_types);
    this.setNextStatement(true, node_types);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl(help_url);
  }
};

Blockly.Blocks['sequence_node'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("(->) Sequence Node");
    this.appendStatementInput("Children")
        .setCheck(node_types);
    this.setPreviousStatement(true, node_types);
    this.setNextStatement(true, node_types);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl(help_url);
  }
};

Blockly.Blocks['root_node'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("[ ] Root Node");
    this.appendStatementInput("Children")
        .setCheck(node_types);
    this.setOutput(true, null);
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl(help_url);
  }
};

Blockly.Blocks['action_node'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Action Node");
    this.appendValueInput("NAME")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};