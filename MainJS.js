var GameIsStarted = 0

function start_game(){
    GameIsStarted += 1          //protector for a game
    if (GameIsStarted==1){      // without it game can be started twice which is not good
        Game()
    }
}




var ChosenLevel = 0
function levelChoosing(){       //choosing of level, later more levels will be added
    ChosenLevel = document.getElementById("select_level").value
}


function Game(){//starting of a game , defining global variables, images etc.
    var ctx = canvas.getContext("2d");
    var w = canvas.width
    var h = canvas.height
    var MovingRight = false
    var MovingLeft = false
    var MovingDown = false
    var MovingUp = false
    var Uwon = false
    var UcanEatGhostsNow = false
    score.value = 0
    var CherryDraw = new Image()
    CherryDraw.src = 'Cherry.png'
    var scaredghost = new Image()
    scaredghost.src = 'scaredghost.png'
    var blueghost = new Image()
    blueghost.src = 'blueghost.jpg'


    
        

    var level1 = { //first level and its properties
        scale : 50,
        map : [[0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],  //level's map is a matrix of values such as 0,1,2
            [1,1,1,1,1,0,1,0,1,0,0,0,0,1,1,0],      // where 0 is just a dot, which we need to collect
            [0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0],      // 1 is a wall
            [0,1,0,0,1,1,1,0,1,0,1,0,0,0,0,0],      // 2 is a cherry
            [0,1,0,0,0,0,0,0,0,0,1,0,1,1,0,1],      // 3 is a big dote. If u eat it u can eat ghosts
            [0,1,1,0,1,0,0,1,1,0,1,0,0,0,0,0],
            [1,1,0,2,1,0,0,3,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,1,0,0,1,0,1,1,1,0,0],
            [1,1,0,1,1,0,1,1,1,1,0,1,0,0,0,0],
            [1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0],
            [0,0,1,0,1,0,1,0,1,1,2,1,0,0,1,0],
            [1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
            [0,1,1,1,0,1,0,1,0,0,0,0,0,1,1,0],
            [0,1,1,0,2,1,0,0,0,1,1,1,0,1,0,0],
            [0,0,0,0,1,1,0,1,0,1,1,1,0,0,0,0]],
        ghostamount : 3, // obv amount of a ghosts
        draw : (ctx)=>{
            for (let i= 0; i< level1.map.length;i++ ){   //to draw level we need to go through all elements of array   
                for (let j= 0;j<level1.map[i].length;j++){ // and draw specidicly the object we need
                    if (level1.map[i][j]==1){ // wall
                        ctx.fillStyle = "black"
                        ctx.fillRect(i*level1.scale,j*level1.scale,level1.scale,level1.scale)

                    }
                    if(level1.map[i][j]==2){// cherry
                        ctx.drawImage(CherryDraw,i*level1.scale,j*level1.scale,level1.scale,level1.scale)
                    }
                    if (level1.map[i][j]==0){//small dote
                        ctx.beginPath()
                        ctx.arc(i*level1.scale+level1.scale/2,j*level1.scale+level1.scale/2,3,0,2*Math.PI)
                        ctx.fillStyle = "grey"
                        ctx.fill()

                    }
                    if(level1.map[i][j]==3){//big dote
                        ctx.beginPath()
                        ctx.arc(i*level1.scale+level1.scale/2,j*level1.scale+level1.scale/2,10,0,2*Math.PI)
                        ctx.fillStyle = "grey"
                        ctx.fill() 
                    }
                }
            
            }
        }
    }
    
    

    
    
    
    
    var Pacman ={// here is pacman. (x and y are its coordinates)
        x:0,
        y:0,
        draw: (ctx)=>{//drawing packman
            ctx.beginPath()
            ctx.arc(Pacman.x+level1.scale/2,Pacman.y+level1.scale/2,(level1.scale/2)-10,0,2*Math.PI)
            ctx.fillStyle = "yellow"
            ctx.fill()
        }
    }
    onkeydown = (e)=>{// packman changing direction depending on pressed key 
        if (e.key == 'ArrowLeft'){
            MovingRight = false
            MovingLeft = true
            MovingDown = false
            MovingUp = false
        }
        if (e.key == 'ArrowRight'){
            MovingRight = true
            MovingLeft = false
            MovingDown = false
            MovingUp = false
        }
        if (e.key == 'ArrowDown'){
            MovingRight = false
            MovingLeft = false
            MovingDown = true
            MovingUp = false
        }
        if (e.key == 'ArrowUp'){
            MovingRight = false
            MovingLeft = false
            MovingDown = false
            MovingUp = true
        }
    }

    function movement(){// movement of pacman 
        ctx.clearRect(Pacman.x+10,Pacman.y+10,level1.scale-20,level1.scale-20)
        if(MovingRight){
            Pacman.x += 1
        }
        if(MovingLeft){
            Pacman.x -= 1

        }
        if(MovingUp){
            Pacman.y -= 1
        }
        if(MovingDown){
            Pacman.y += 1
        }
        
        Pacman.draw(ctx) 
        
    }

    function Lost(){ //functions and actions we need to run when player lost
        GameIsStarted = 0
        alert("U lost. Restart?")
        clearInterval(fps)
        clearInterval(Gfps)
        restart()
    }

    function restart(){
        ctx.clearRect(0,0,w,h)
        Pacman.x = 0
        Pacman.y = 0 
        MovingRight = false
        MovingLeft = false
        MovingDown = false
        MovingUp = false
        score.value =0
    }

    function win(){ //functions and actions we need to run when player win
        var lineswitoutzeros = 0
        for (let i = 0; i<level1.map.length;i++){
           
            if(!level1.map[i].includes(0)){
                lineswitoutzeros+=1
                    
            }
            if(lineswitoutzeros==level1.map[i].length){//condition
                alert("won ")
                GameIsStarted = 0
                clearInterval(fps)
                restart()
            }
            
            
        }
        
    }



    function Collider(){//obv function which detect collition with sth
        if(Pacman.x>w||Pacman.x<0||Pacman.y>h||Pacman.y<0){
            Lost() 
        }
        for (let i = 0;i<Ghosts.length;i++){
            if (Math.round(Pacman.x/level1.scale)==Ghosts[i].x&&Math.round(Pacman.y/level1.scale)==Ghosts[i].y&&!UcanEatGhostsNow){
                Lost()
            }
            if(Math.round(Pacman.x/level1.scale)==Ghosts[i].x&&Math.round(Pacman.y/level1.scale)==Ghosts[i].y&&UcanEatGhostsNow){
                Ghosts.splice(i,1)
                score.value = Number(score.value) +100
            }
        }
        for (let i = 0;i<level1.map.length;i++){
            for (let j = 0;j<level1.map[i].length;j++){
                
                if (level1.map[i][j]==1){
                    if((Pacman.x>(i*level1.scale-level1.scale/2))&&(Pacman.x<(i*level1.scale+level1.scale/2))&&(Pacman.y>(j*level1.scale-level1.scale/2))&&(Pacman.y<(j*level1.scale+level1.scale/2))){
                        Lost()
                    }
                }
                if(level1.map[i][j]==0){
                    if((Pacman.x>(i*level1.scale-level1.scale/2))&&(Pacman.x<(i*level1.scale+level1.scale/2))&&(Pacman.y>(j*level1.scale-level1.scale/2))&&(Pacman.y<(j*level1.scale+level1.scale/2))){
                        level1.map[i][j]=-1
                        ctx.clearRect(i*level1.scale,j*level1.scale,level1.scale,level1.scale)
                        score.value = Number(score.value) +5
                    } 
                }
                if(level1.map[i][j]==2){
                    if((Pacman.x>(i*level1.scale-level1.scale/2))&&(Pacman.x<(i*level1.scale+level1.scale/2))&&(Pacman.y>(j*level1.scale-level1.scale/2))&&(Pacman.y<(j*level1.scale+level1.scale/2))){
                        level1.map[i][j]=-1
                        ctx.clearRect(i*level1.scale,j*level1.scale,level1.scale,level1.scale)
                        score.value = Number(score.value) +50
                    } 
                }
                if(level1.map[i][j]==3){
                    if((Pacman.x>(i*level1.scale-level1.scale/2))&&(Pacman.x<(i*level1.scale+level1.scale/2))&&(Pacman.y>(j*level1.scale-level1.scale/2))&&(Pacman.y<(j*level1.scale+level1.scale/2))){
                        level1.map[i][j]=-1
                        ctx.clearRect(i*level1.scale,j*level1.scale,level1.scale,level1.scale)
                        UcanEatGhostsNow = true
                        setTimeout(() => {
                            UcanEatGhostsNow = false;
                          }, 30000);
                    } 
                }


            }
        }
    }
    var Ghosts = []//array of ghosts
    function Ghost(x,y,direction,number){//ghosts constructor
        this.x = x
        this.y = y
        this.direction = direction
        this.number = number
        this.draw = (ctx)=>{
            if(UcanEatGhostsNow){
                ctx.drawImage(scaredghost,this.x*level1.scale,this.y*level1.scale,level1.scale,level1.scale)
            }else{
                ctx.drawImage(blueghost,this.x*level1.scale,this.y*level1.scale,level1.scale,level1.scale)
            }
        }
    }
    for (let i = 1;i<level1.ghostamount+1;i++){ //adding actual ghosts depending on level settings
        let RandomDirection = Math.round(Math.random()*3)
        let XRandomPosition = Math.round(Math.random()*14+1)
        let YRandomPosition = Math.round(Math.random()*14+1)
        let GoodRandom = false
        while (!GoodRandom){
            if (level1.map[XRandomPosition][YRandomPosition]==1){
                XRandomPosition = Math.round(Math.random()*14+1)
                YRandomPosition = Math.round(Math.random()*14+1)
            }else{
                GoodRandom = true
            }
        }
        
        let G = new Ghost(XRandomPosition,YRandomPosition,RandomDirection,i)
        Ghosts.push(G)
    }
    
    function ghostsMechanic(){//all ghosts mechanics except colliding
        for (let i = 0;i<Ghosts.length;i++){
            Ghosts[i].draw(ctx)
            var WaysToGo = [false,false,false,false] 
            // [Up,Right,Down,Left] this is an array which contains information about surrounding walls
            //0 (UP x,y-1)
            if((level1.map[Ghosts[i].x][Ghosts[i].y-1]==undefined)){
                WaysToGo[0] = false 
            }else{
                if (!(level1.map[Ghosts[i].x][Ghosts[i].y-1]==1)){
                    WaysToGo[0] = true
                }else{
                    WaysToGo[0] = false 
                }
            }
            //1 (Right x+1,y)
            if((level1.map[Ghosts[i].x+1]==undefined)){
                WaysToGo[1] = false 
            }else{
                if (!(level1.map[Ghosts[i].x+1][Ghosts[i].y]==1)){
                    WaysToGo[1] = true
                }else{
                    WaysToGo[1] = false 
                }
            }
            //2 (down x,y+1)
            if((level1.map[Ghosts[i].x][Ghosts[i].y+1]==undefined)){
                WaysToGo[2] = false 
            }else{
                if (!(level1.map[Ghosts[i].x][Ghosts[i].y+1]==1)){
                    WaysToGo[2] = true
                }else{
                    WaysToGo[2] = false 
                }
            }
            //3 (left x-1,y)
            if((level1.map[Ghosts[i].x-1]==undefined)){
                WaysToGo[3] = false 
            }else{
                if (!(level1.map[Ghosts[i].x-1][Ghosts[i].y]==1)){
                    WaysToGo[3] = true
                }else{
                    WaysToGo[3] = false 
                }
            } // Array is filled now and since function updates, array updates too
    

            function changeDirection(){// function of change direction of ghosts
                var Rand = Math.round(Math.random()*3)
                let changed = false
                while(!changed){
                    
                    if (WaysToGo[Rand]){
                        Ghosts[i].direction = Rand
                        changed = true
                    }else{
                        Rand = 0 + Math.round(Math.random()*3)

                    }
                }
            }
            for(let j = 0;j<WaysToGo.length;j++){//condition of changing direction
                
                if (Ghosts[i].direction==j&&!WaysToGo[j]){
                    changeDirection()
                }
            }


            function GhostMovement(){
                ctx.clearRect(Ghosts[i].x*level1.scale,Ghosts[i].y*level1.scale,level1.scale,level1.scale)
                if (Ghosts[i].direction == 0){
                    Ghosts[i].y -= 1
                    Ghosts[i].draw(ctx)
                }
                if (Ghosts[i].direction == 1){
                    
                    Ghosts[i].x += 1
                    Ghosts[i].draw(ctx)
                }
                if (Ghosts[i].direction == 2){
                    
                    Ghosts[i].y += 1
                    Ghosts[i].draw(ctx)
                }
                if (Ghosts[i].direction == 3){
                    
                    Ghosts[i].x -= 1
                    Ghosts[i].draw(ctx)
                }

            }
            GhostMovement()
                        
        }

    }
    

    function control(){//in this function I keep all function I need to update every frame
        win()
        level1.draw(ctx)
        movement()
        Collider()
        
        
    }   
    var fps = setInterval(control,20)
    var Gfps = setInterval(ghostsMechanic,900)
}
