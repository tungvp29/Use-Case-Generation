const app = {
    options: {
      originalFontSize: Number,
      _data: [],
      _drawArea: null,
      drawButton: {
        btnDrawStart: '',
        btnDrawNext: '',
        btnDrawPrev: '',
        showDrawCurrent: '',
      },
      useCase: {
        size: {
          width: 200,
          height: 60,
          distance: 100,
          useCasePersonDistance: 200,
        },
        shape: 'rectangle',
        ucPerPic: 8,
        currentDraw: '',
      },
      person: {
        shape: 'thin',
      },
      arrowSize: Number,
      layout: 'right' | 'left' | 'both',
    },
    data: [],
    drawArea: null,
    buttons: {
      drawStart: Element,
      drawNext: Element,
      drawPrev: Element,
      drawCurrent: Element,
    },
    init: function() {
      data = this.options._data;
      drawArea = this.options._drawArea;
      this.options.arrowSize = this.options.arrowSize || 10;
      this.options.useCase.size.width = this.options.useCase.size.width || 200;
      this.options.useCase.size.height = this.options.useCase.size.height || 60;
      this.options.useCase.size.distance = this.options.useCase.size.distance || 50;
      this.options.useCase.size.useCasePersonDistance = this.options.useCase.size.useCasePersonDistance || 200;
      this.options.layout = this.options.layout || 'both';
      this.options.useCase.shape = this.options.useCase.shape || 'rectangle';
      this.options.useCase.ucPerPic = this.options.useCase.ucPerPic || 8;
      this.options.person.shape = this.options.person.shape || 'thin';
      originalFontSize = this.options.originalFontSize;
      buttons = {
        drawStart: document.getElementById(this.options.drawButton.btnDrawStart),
        drawNext: document.getElementById(this.options.drawButton.btnDrawNext),
        drawPrev: document.getElementById(this.options.drawButton.btnDrawPrev),
        drawCurrent: document.getElementById(this.options.drawButton.showDrawCurrent),
      };
    },
    start: function() {
      if (drawArea === null) {
        console.error('drawArea is null. Did you forget to call init?');
        return;
      }
      const calculatedPosition = this.CalculatePosition(1, 8);
      console.log(calculatedPosition);
      this.DrawBiggerPerson(calculatedPosition.person.x, calculatedPosition.person.y);
    //   const person = this.DrawPerson();
    //   // Draw all use cases
    //   data.slice(0,4).forEach((item) => {
    //     uc = this.DrawUseCase(item.x, item.y, item.name, this.options.useCase.shape);
    //     ConnectObject(person, uc);
    //   });
    },
    draw: function(_from, _to) {
      _from = parseInt(_from);
      _to = parseInt(_to);
      drawArea.clear().renderAll();
      // Calculate position for person and use cases
      const calculatedPosition = this.CalculatePosition(_from, _to);
      let person;
      if (this.options.person.shape === 'bigger'){
        // const person = this.DrawBiggerPerson(calculatedPosition.person.x, calculatedPosition.person.y);
        person = this.DrawBiggerPerson(calculatedPosition.person.x, calculatedPosition.person.y, data[_to-1].actor);
      } else if (this.options.person.shape === 'thin'){
        person = this.DrawPerson(calculatedPosition.person, data[_to-1].actor);
      }

      ucStartX1 = calculatedPosition.ucStartPos.x1;
      ucStartY1 = calculatedPosition.ucStartPos.y1;
      // Draw all use cases from _from to _to and connect them to person object by arrow line
      if (this.options.layout === 'both'){
        ucStartX2 = calculatedPosition.ucStartPos.x2;
        ucStartY2 = calculatedPosition.ucStartPos.y2;

        const _mid = Math.ceil((_to + _from) / 2);
        data.slice(_from, _mid).forEach((item) => {
          ucStartY1 += this.options.useCase.size.height + this.options.useCase.size.distance;
          uc = this.DrawUseCase(ucStartX1, ucStartY1, item.name, this.options.useCase.shape);
          this.ConnectObjectByArrow(person, uc);
        });
        data.slice(_mid, _to).forEach((item) => {
          ucStartY2 += this.options.useCase.size.height + this.options.useCase.size.distance;
          uc = this.DrawUseCase(ucStartX2, ucStartY2, item.name, this.options.useCase.shape);
          this.ConnectObjectByArrow(person, uc);
        });
      } else {
        data.slice(_from, _to).forEach((item) => {
          ucStartY1 += this.options.useCase.size.height + this.options.useCase.size.distance;
          uc = this.DrawUseCase(ucStartX1, ucStartY1, item.name, this.options.useCase.shape);
          this.ConnectObjectByArrow(person, uc);
        });
      }
      this.UpdateButtons(_from, _to);
      
      drawArea.renderAll();
    },
    clear: () => {
      drawArea.clear().renderAll();
    },
    end: () => {},
    
    DrawPerson: function(pos, _text = 'Actor') {
      // Create the head
      const head = new fabric.Circle({
        left: 80,
        top: 100,
        radius: 20,
        fill: '#f0f0f0',
        stroke: 'black',
        strokeWidth: 1,
      });

      // Create the body
      const body = new fabric.Line([100, 140, 100, 200], {
        stroke: 'black',
        strokeWidth: 1,
      });

      // Create the arms
      const leftArm = new fabric.Line([100, 150, 80, 180], {
        stroke: 'black',
        strokeWidth: 1,
      });
      const rightArm = new fabric.Line([100, 150, 120, 180], {
        stroke: 'black',
        strokeWidth: 1,
      });

      // Create the legs
      const leftLeg = new fabric.Line([100, 200, 80, 240], {
        stroke: 'black',
        strokeWidth: 1,
      });
      const rightLeg = new fabric.Line([100, 200, 120, 240], {
        stroke: 'black',
        strokeWidth: 1,
      });
      
      const text = new fabric.Textbox(_text, {
        originX: 'center',
        originY: 'center',
        left: 100, // Same as ellipse center X
        top: 255, // Same as ellipse center Y
        fontSize: originalFontSize,
        fill: 'black',
        //width: body.width - 10,
        textAlign: 'center',
        //height: 50,
        //overflow: 'ellipse' // Truncate the text with an ellipsis when it overflows the text box
      });

      // Group all parts together
      const person = new fabric.Group([head, body, leftArm, rightArm, leftLeg, rightLeg, text], {
        left: pos.x,
        top: pos.y,
      });

      drawArea.add(person);
      return person;
    },
    DrawBiggerPerson: function(x, y, _text = 'Actor') {
      var head = new fabric.Circle({
          left: x,
          top: y,
          radius: 30,
          fill: '#f0f0f0',
          stroke: 'black',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center'
      });

      var body = new fabric.Rect({
          left: x,
          top: y + 60,
          width: 60,
          height: 60,
          fill: '#f0f0f0',
          stroke: 'black',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center'
      });

      var leftArm = new fabric.Rect({
          left: x - 40,
          top: y + 60,
          width: 20,
          height: 60,
          fill: '#f0f0f0',
          stroke: 'black',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center'
      });

      var rightArm = new fabric.Rect({
          left: x + 40,
          top: y + 60,
          width: 20,
          height: 60,
          fill: '#f0f0f0',
          stroke: 'black',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center'
      });

      var leftLeg = new fabric.Rect({
          left: x - 15,
          top: y + 120,
          width: 30,
          height: 60,
          fill: '#f0f0f0',
          stroke: 'black',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center'
      });

      var rightLeg = new fabric.Rect({
          left: x + 15,
          top: y + 120,
          width: 30,
          height: 60,
          fill: '#f0f0f0',
          stroke: 'black',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center'
      });
      var person = new fabric.Group([head, body, leftArm, rightArm, leftLeg, rightLeg, path], {
          left: x-30,
          top: y
      });
      
      drawArea.add(person);
      return person;
    },
    DrawUseCase: function (_left, _top, _text = 'Use Case', shape = 'ellipse'){
      centerX = drawArea.width / 2;
      centerY = drawArea.height / 2;
      if(this.options.layout === 'left'){
        centerX = drawArea.width / 4;
      } else if(this.options.layout === 'right'){
        centerX = drawArea.width * 3 / 4;
      } else if(this.options.layout === 'both'){
        centerX = drawArea.width / 2;
      }

      let shapeObj = null;
      let textLeft = 0;
      let textTop = 0;
      if(shape === 'ellipse'){
        shapeObj = this.DrawEllipse(_left, _top);
        textLeft = shapeObj.left + shapeObj.rx;
        textTop = shapeObj.top + shapeObj.ry;
      } else if(shape === this.options.useCase.shape){
        shapeObj = this.DrawRectangle(_left, _top);
        textLeft = shapeObj.left + shapeObj.width / 2;
        textTop = shapeObj.top + shapeObj.height / 2;
      }
      
      var text = new fabric.Textbox(_text, {
        originX: 'center',
        originY: 'center',
        left: textLeft, // Same as ellipse center X
        top: textTop, // Same as ellipse center Y
        fontSize: originalFontSize,
        fill: 'black',
        width: shapeObj.width - 10,
        textAlign: 'center',
        //height: 50,
        //overflow: 'ellipse' // Truncate the text with an ellipsis when it overflows the text box
      });
      
      var group = new fabric.Group([shapeObj, text], {
        left: _left,
        top: _top,
        lockUniScaling: true
      });
      group.on('scaling', function() {
        const scale = Math.min(this.scaleX, this.scaleY);
        const objects = this.getObjects();
        const textInObject = objects[1];
        textInObject.fontSize = originalFontSize / scale;
        textInObject.scaleX = 1;
        textInObject.scaleY = 1;
        textInObject.left = textInObject.left / scale;
        textInObject.top = textInObject.top / scale;
      });
      drawArea.add(group);
      return group;
    },
  
    DrawRectangle: function(_left, _top){
      var rect = new fabric.Rect({
        left: _left,
        top: _top,
        width: this.options.useCase.size.width,
        height: this.options.useCase.size.height,
        rx: 10,
        ry: 10,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
      });
      return rect;
    },

    DrawEllipse: function(_left, _top){
      var ellipse = new fabric.Ellipse({
        left: _left,
        top: _top,
        rx: this.options.useCase.size.width/2, // Horizontal radius
        ry: this.options.useCase.size.height/2, // Vertical radius
        fill: 'white',   
        stroke: 'black', 
        strokeWidth: 1, 
      });
      return ellipse;
    },
  
    ConnectObject: function(person, useCase){
      var to = new fabric.Point(tox, toy);

      var personCenterX = person.left + person.width;
      var personCenterY = person.top + person.height / 2;
      var from = new fabric.Point(fromx, fromy);

      var ellipseCenterX = useCase.left;
      var ellipseCenterY = useCase.top + useCase.height / 2;
      
      var line = new fabric.Line([personCenterX, personCenterY, ellipseCenterX, ellipseCenterY], {
          stroke: 'black',
          strokeWidth: 1,
      });
      canvas.add(line);

      person.on('moving', function () {
        line.set({ x1: person.left + person.width / 2, y1: person.top + person.height / 2 });
        canvas.renderAll();
      });

      useCase.on('moving', function () {
        var newHeight = this.height * this.scaleY;
        line.set({x2: useCase.left, y2: useCase.top + newHeight / 2});
        canvas.renderAll();
      });

      useCase.on('scaling', function () {
        var newHeight = this.height * this.scaleY;
        line.set({x2: this.left, y2: this.top + newHeight / 2});
        canvas.renderAll();
      });
    },

    ConnectObjectByArrow: function(person, useCase){
      var fromX = person.left + person.width;
      var fromY = person.top + person.height / 2;

      var toX = useCase.left;
      var toY = useCase.top + useCase.height / 2;

      if (person.left > useCase.left) {
        fromX = person.left;
        fromY = person.top + person.height / 2;
        toX = useCase.left + useCase.width;
        toY = useCase.top + useCase.height / 2;
      } else {
        fromX = person.left + person.width;
        fromY = person.top + person.height / 2;
        toX = useCase.left;
        toY = useCase.top + useCase.height / 2;
      }

      var line = new fabric.Line([fromX, fromY, toX, toY], {
          stroke: 'black',
          strokeWidth: 1,
      });

      var angle = Math.atan2(toY - fromY, toX - fromX);

      // Create triangle (arrow head)
      var arrow = new fabric.Triangle({
        left: toX,
        top: toY,
        originX: 'center',
        originY: 'center',
        width: this.options.arrowSize,
        height: this.options.arrowSize,
        fill: 'black',
        angle: angle * (180 / Math.PI) + 90,
        selectable: false
      });
      canvas.add(line, arrow);

      person.on('moving', function () {
        if (person.left > useCase.left) {
          line.set({ 
            x1: person.left, 
            y1: person.top + person.height / 2,
            x2: useCase.left + useCase.width, 
            y2: useCase.top + useCase.height / 2
          });
        } else {
          line.set({ 
            x1: person.left + person.width, 
            y1: person.top + person.height / 2, 
            x2: useCase.left, 
            y2: useCase.top + useCase.height / 2
          });
        }
        //line.set({ x1: person.left + person.width, y1: person.top + person.height / 2 });
        var newAngle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
        arrow.set({ 'left': line.get('x2'), 'top': line.get('y2'), angle: newAngle * (180 / Math.PI) + 90 });
        canvas.renderAll();
      });

      useCase.on('moving', function () {
        var newHeight = this.height * this.scaleY;
        if (person.left > useCase.left) {
          line.set({
            x1: person.left, 
            y1: person.top + person.height / 2,
            x2: useCase.left + useCase.width, 
            y2: useCase.top + newHeight / 2});
        } else {
          line.set({
            x1: person.left + person.width, 
            y1: person.top + person.height / 2, 
            x2: useCase.left, 
            y2: useCase.top + newHeight / 2});
        }
        //line.set({x2: useCase.left, y2: useCase.top + newHeight / 2});
        var newAngle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
        arrow.set({ 'left': line.get('x2'), 'top': line.get('y2'), angle: newAngle * (180 / Math.PI) + 90 });
        canvas.renderAll();
      });

      useCase.on('scaling', function () {
        var newHeight = this.height * this.scaleY;
        if (person.left > useCase.left) {
          line.set({x2: useCase.left + useCase.width, y2: useCase.top + newHeight / 2});
        } else {
          line.set({x2: useCase.left, y2: useCase.top + newHeight / 2});
        }
        //line.set({x2: this.left, y2: this.top + newHeight / 2});
        var newAngle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
        arrow.set({ 'left': line.get('x2'), 'top': line.get('y2'), angle: newAngle * (180 / Math.PI) + 90 });
        canvas.renderAll();
      });
    },
    
    CalculatePosition: function(from, to) {
      const ucHeight = this.options.useCase.size.height;
      const ucDistance = this.options.useCase.size.distance;
      if (this.options.layout === 'both') {
        const _mid = Math.ceil((to + from) / 2);
        to = _mid;
      }
      let centerX = drawArea.width / 2;
      let maxHeight = ucHeight * (to - from) + (ucHeight + ucDistance) * (to - from - 1);
      let centerY = maxHeight / 2 - 70; //person half height
      let ucX1 = 0;
      let ucY1 = 10;
      let ucX2 = 0;
      let ucY2 = 10;
      let ucPersonDistance = this.options.useCase.size.useCasePersonDistance;
      if(this.options.layout === 'left'){
        centerX = drawArea.width / 4 ;
        ucX1 = centerX + ucPersonDistance;
      } else if(this.options.layout === 'right'){
        centerX = drawArea.width * 3 / 4;
        ucX1 = centerX - this.options.useCase.size.width - ucPersonDistance;
      } else if(this.options.layout === 'both'){
        centerX = drawArea.width / 2;
        ucX1 = centerX - this.options.useCase.size.width - ucPersonDistance;
        ucX2 = centerX + ucPersonDistance;
      }

      return {
        person: {
          x: centerX - 20,  //person half width
          y: centerY, 
        },
        ucStartPos: {
          x1: ucX1,
          y1: ucY1,
          x2: ucX2,
          y2: ucY2,
        },
      };
    },
  
    UpdateButtons: function(_from, _to) {
      if (this.options.drawButton.showDrawCurrent !== ''){
        buttons.drawCurrent.value = `${_from} - ${_to}`;
      }
      if (_from >= this.options.useCase.ucPerPic) {
        buttons.drawPrev.disabled = false;
        buttons.drawPrev.dataset.from = _from - this.options.useCase.ucPerPic;
        buttons.drawPrev.dataset.to = _from;
      } else {
        buttons.drawPrev.disabled = true;
      }
      if (_to < data.length) {
        buttons.drawNext.disabled = false;
        buttons.drawNext.dataset.from = _to;
        buttons.drawNext.dataset.to = _to + this.options.useCase.ucPerPic;
      } else {
        buttons.drawNext.disabled = true;
      }
    }
}