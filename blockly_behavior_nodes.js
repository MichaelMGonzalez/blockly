var node_types = ["selector_node", "sequence_node", "inverter_node"];
var help_url = "http://robots.gadgetron.build/TAZI/help.html"
// Look into mutators
// https://developers.google.com/blockly/guides/create-custom-blocks/mutators

// A good example implementation can be found in
// blocks/logic.js

var mutator_child = "Child"

var mutator = function(name, prev, next) {
return {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
    init: function() {
        this.setColour(Blockly.Blocks.logic.HUE);
        this.appendDummyInput()
            .appendField(name);

        this.setNextStatement(next);
        this.setPreviousStatement(prev);
        this.contextMenu = false;
    }
  }
};

var BehaviorNode = function ( name, color )  {
return {
    init : function() {
        this.appendDummyInput()
            .appendField(name);
        this.appendStatementInput("Children0")
            .setCheck(["selector_node", node_types])
            .appendField(mutator_child);
        this.setPreviousStatement(true, node_types);
        this.setColour(color);
        this.setHelpUrl(help_url);
        this.setTooltip('');
        this.setMutator(new Blockly.Mutator(['behavior_node_extra']));
        this.children_count = 0;
    },
    
    /**
     * Create XML to represent the number of else-if and else inputs.
     * @return {Element} XML storage element.
      * @this Blockly.Block
      */
    mutationToDom: function() {
        if (!this.children_count) {
            return null;
        }
        var container = document.createElement('mutation');
        if (this.children_count) {
            container.setAttribute('children_count', this.children_count);
        }
        return container;
    },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
    domToMutation: function(xmlElement) {
        this.children_count = parseInt(xmlElement.getAttribute('children_count'), 10) || 0;
        this.updateShape_();
    },
    decompose: function(workspace) {
        var containerBlock = workspace.newBlock('behavior_node_start');
        containerBlock.initSvg();
        var connection = containerBlock.nextConnection;
        for (var i = 1; i <= this.children_count; i++) {
            var childBlock= workspace.newBlock('behavior_node_extra');
            childBlock.initSvg();
            connection.connect(childBlock.previousConnection);
            connection = childBlock.nextConnection;
        }
        return containerBlock;
        },
          /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.children_count = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'behavior_node_extra':
          this.children_count++;
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 1; i <= this.children_count; i++) {
      Blockly.Mutator.reconnect(statementConnections[i], this, mutator_child + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'behavior_node_extra':
          var inputDo = this.getInput(mutator_child + i);
            clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    var i = 1;
    while (this.getInput(mutator_child + i)) {
      this.removeInput(mutator_child + i);
      i++;
    }
    // Rebuild block.
    for (var i = 1; i <= this.children_count; i++) {
      this.appendStatementInput(mutator_child + i)
          .appendField(mutator_child);
    }
  }
    }
};

Blockly.Blocks['selector_node'] = new BehaviorNode("(?) Selector Node", 120);
Blockly.Blocks['sequence_node'] = new BehaviorNode("(->) Sequence Node", 180);
Blockly.Blocks['root_node'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("[ ] Root Node");
    this.appendStatementInput("Children")
        .setCheck(node_types);
    this.setOutput(true, null);
    this.setColour(60);
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
  }
};


Blockly.Blocks['behavior_node_start'] = mutator( "Number of Child Behaviors", false, true ) ;
Blockly.Blocks['behavior_node_extra'] = mutator( "Extra Behavior", true, true ) ;

