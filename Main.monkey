Import mojo
Import brl

Const STATE_MENU:Int = 0 'GAMESTATE CONSTANTS THAT REPRESENT THE VARIOUS STATES OF MY GAME
Const STATE_INTRO:Int = 1
Const STATE_GAME:Int = 2
Const STATE_BOSS:Int = 3
Const STATE_END:Int = 4
Const STATE_GAMEOVER:Int = 5
Global GameState:int


Const SCREEN_HEIGHT = 480 'THE BASE SCREEN RESOLUTION WHICH WILL BE USED IN VARIOUS STATEMENTS
Const SCREEN_WIDTH = 640

Const TILE_SIZE = 32 'THE AVERAGE SIZE OF MOST OF THE TILES IN THE GAME
Global menu:MenuClass 'MENU CLASS IS GLOBAL AS OTHER CLASSES WILL AFFECT THIS CLASS WITHOUT THE NEED OF HAVING TO WRITE THE CODE WITHIN THE DARKDUNGEON CLASS

Global MeleeFX:Sound
Global ShootFX:Sound

Class DarkDungeon Extends App'CREATION OF THE MAIN CLASS WHICH EXTENDS APP WHICH ALLOWS THE INTEGRATION OF OTHER CLASSES WITHIN IT
	
	Field MapWidth:Int 'CONSTANT FOR MAPWIDTH
	Field MapOffset:Float
	Field player:Player'	DECLARATION OF CLASS AND CLASS LISTS TO SET IN THE GAME
	Field boss:List<Boss> = New List<Boss>()
	Field map:Map
	Field blocks:List<Block> = New List<Block>()
	Field doors:List<Door> = New List<Door>()
	Field enemies:List<Enemy> = New List<Enemy>()
	Field enemies2:List<Enemy2> = New List<Enemy2>()
	Field lever:List<Lever> = New List<Lever>()
	Field playerProjectiles:List<PlayerProjectile> = New List<PlayerProjectile>()
	Field enemyProjectiles:List<PlayerProjectile> = New List<PlayerProjectile>()
	Field MapCounter:Int = 1 'TEST VARIABLE FOR BOSS STAGE
	
	Field IntroCutsceneCounter:Int = 0'	This is a counter to act as a index to the cutscene list.
	Field IntroFrames:String[] = ["*You awake in a cold cell*","The cell door is unlocked, you push through...","Already donning appropriate gear you traverse the dungeon."]' The cutscene is text based, this list stores the text.
	
	
	Field EndCutsceneCounter:Int = 0
	Field EndFrames:String[] = ["You have defeated the boss and march on forth","The exploration of the dungeon has left you drained.","You have become exhausted...","Continuing forth, you see light before collapsing..."]
	
	Field Death:Bool = False
	
	Field NextLevelFX:Sound 
	Field EnemyShootFX:Sound 
	
	Method OnCreate()							'Lines of code that will be executed when the program is run:
		SetUpdateRate(60)						'The refresh rate is set to 60 per second, the game updates 60 times per second.
		MapWidth = SCREEN_WIDTH/TILE_SIZE		'this gives an integer value of how many tiles can fit within the width of the map
		MapOffset = (SCREEN_WIDTH Mod TILE_SIZE)/2
		GameState = STATE_MENU					'On creation the game state start on the menu state
		menu = New MenuClass()					'The menu class is the class that operates the menu and functions before the game
		player = New Player(SCREEN_WIDTH/2,SCREEN_HEIGHT/2,100,100)'The player class is created with the coordinate location and max hp and sp set in the parameters
		map = New Map							'New map is the class that stores all map loading functions
		
		PlayMusic("Journey Music.ogg",1)
		MeleeFX = LoadSound("SwordFX.wav")'PlaySound(MeleeFX)
		ShootFX = LoadSound("ShootFX.wav")'PlaySound(ShootFX)
		NextLevelFX = LoadSound("NextLevel.wav")'PlaySound(NextLevelFX)
		EnemyShootFX = LoadSound("EnemyFire.wav")
		
	End
	
	Method OnUpdate()							'the method where all game updates are located and executed 60 time per second:
		Select GameState						'A select statement is used to split the various parts of the game into sections.
		
			Case STATE_MENU						'Menu section:
				menu.Update()					'Menu class is updated here: LINE 632
				
				'SHORTCUTS
				'If KeyHit(KEY_E) Then GameState = STATE_INTRO
			
			Case STATE_INTRO					'Introduction cutscene section:
				If KeyHit(KEY_LMB) Then IntroCutsceneCounter = IntroCutsceneCounter + 1'The counter for intro cutscene increments to the next frame
				If IntroCutsceneCounter >= IntroFrames.Length'if the counter goes beyond the length of the list then all the items have been covered
				 	IntroCutsceneCounter = IntroFrames.Length'thus the counter is set to the limit to not equal an out of bound error
					GameState = STATE_GAME		'And the intro state has ended and is passed to the next state- the game state.
				Endif 
			
				'SHORTCUTS
				'If KeyHit(KEY_E) Then GameState = STATE_GAME
			
			Case STATE_GAME						'The state where all the game code is contained:
				player.Update()					'Player class is updated: LINE 695
				If player.NewProjectile = 60	'If statement to create a new projectile class when the statment is triggered when the variable is 60
					'PlaySound(ShootFX)
					playerProjectiles.AddLast(New PlayerProjectile(player.Position.x,player.Position.y,player.Direction,2,True))'the parameters applied to the creation of a new class: 
					'																											Spawn position on the player, direction of movement is where the player is facing and speed of projectile.
				End
		
				
				For Local PlayerProjectile:PlayerProjectile = Eachin playerProjectiles'Using a for loop to update all the onjects in the class list of player projectiles
					PlayerProjectile.Update()	'the class is updated: LINE 859
					If PlayerProjectile.TileCollision = True Then playerProjectiles.Remove PlayerProjectile'When the object collides with a wall using the class method for tile collision, the object is deleted.
					For Local Enemy:Enemy = Eachin enemies'Each projectile object in the list is compared to every enemy in the enemy list
						If RectangleOverlap(Enemy.Position.x,Enemy.Position.y,32,32,PlayerProjectile.Position.x,PlayerProjectile.Position.y,8,8)'The general rectangle overlap method is used to detect if the two objects in the for loop are colliding, if true:
							playerProjectiles.Remove PlayerProjectile'The projectile that hit is removed
							enemies.Remove Enemy'The enemy hit is removed
						End If
					Next
					For Local Enemy2:Enemy2 = Eachin enemies2'Each projectile object in the list is compared to every enemy in the enemy2 list: exactly the same as LINES 96-101
						If RectangleOverlap(Enemy2.Position.x,Enemy2.Position.y,32,32,PlayerProjectile.Position.x,PlayerProjectile.Position.y,8,8)
							playerProjectiles.Remove PlayerProjectile
							enemies2.Remove Enemy2
						End If
					Next	
				End
				
				If player.MeleeAttack = True'				When the trigger for melee attack is true: KEY_2 is pressed and the cooldown is off, the player performs a melee attack
					'PlaySound(MeleeFX)
					For Local Enemy:Enemy = Eachin enemies'	A for loop is used to compare the position overlap between the enemies each in the class list and a 32 square hit box overlapping with the player.
						If player.Direction = "E"
							If RectangleOverlap(Enemy.Position.x,Enemy.Position.y,32,32,player.Position.x,player.Position.y-16,32,32) Then enemies.Remove Enemy' Hit detection of a 32 square box to the right of the player to the enemy, if true the enemy is deleted.
						Elseif player.Direction = "W"
							If RectangleOverlap(Enemy.Position.x,Enemy.Position.y,32,32,player.Position.x-32,player.Position.y-16,32,32) Then enemies.Remove Enemy' Hit detection of a 32 square box to the left of the player to the enemy, if true the enemy is deleted.
						Elseif player.Direction = "S"
							If RectangleOverlap(Enemy.Position.x,Enemy.Position.y,32,32,player.Position.x-16,player.Position.y,32,32) Then enemies.Remove Enemy' Hit detection of a 32 square box to the bottom of the player to the enemy, if true the enemy is deleted.
						Elseif player.Direction = "N"
							If RectangleOverlap(Enemy.Position.x,Enemy.Position.y,32,32,player.Position.x-16,player.Position.y-32,32,32) Then enemies.Remove Enemy' Hit detection of a 32 square box to the top of the player to the enemy, if true the enemy is deleted.
						Endif 
					Next
					For Local Enemy2:Enemy2 = Eachin enemies2'	Same process is repeated as seen in LINES: 112 - 124
						If player.Direction = "E"
							If RectangleOverlap(Enemy2.Position.x,Enemy2.Position.y,32,32,player.Position.x,player.Position.y-16,32,32) Then enemies2.Remove Enemy2
						Elseif player.Direction = "W"
							If RectangleOverlap(Enemy2.Position.x,Enemy2.Position.y,32,32,player.Position.x-32,player.Position.y-16,32,32) Then enemies2.Remove Enemy2
						Elseif player.Direction = "S"
							If RectangleOverlap(Enemy2.Position.x,Enemy2.Position.y,32,32,player.Position.x-16,player.Position.y,32,32) Then enemies2.Remove Enemy2
						Elseif player.Direction = "N"
							If RectangleOverlap(Enemy2.Position.x,Enemy2.Position.y,32,32,player.Position.x-16,player.Position.y-32,32,32) Then enemies2.Remove Enemy2
						Endif 
					Next
				Endif
				
				For Local Enemy:Enemy = Eachin enemies' The update method of the enemy class is called upon for each enemy in the class list enemies.
					Enemy.Update()' 					Method LINE: 979
				Next
				
				For Local Enemy2:Enemy2 = Eachin enemies2'	This is the directional face tracking for the enemy each in the enemy 2 class list. 
					If Enemy2.Position.y+32 < player.Position.y-16 ' if the bottom of the enemy is above the top of the player, the enemy looks downwards.
						Enemy2.Direction = "S"
					Elseif Enemy2.Position.y > player.Position.y+16' if the top of the enemy is below the bottom of the player, the enemy looks upwards.
						Enemy2.Direction = "N"
					Else'											 if neither of the above statement is false then:
						If Enemy2.Position.x+16 < player.Position.x-16 Then Enemy2.Direction = "E"' if the enemy is to the left of the player, the enemy looks to the right.
						If Enemy2.Position.x+16 > player.Position.x-16 Then Enemy2.Direction = "W"' if the enemy is to the right of the player, the enemy looks to the left.
					Endif
						
					Enemy2.Update()'The update method is called from the enemy2 class, LINE: 1082
					
					If Enemy2.Shoot = True '						When shoot is true the enemy fires a projectile from the centre of the enemy in the direction the enemy is facing.
						enemyProjectiles.AddLast(New PlayerProjectile(Enemy2.Position.x+16, Enemy2.Position.y+16,Enemy2.Direction,1,False))
						PlaySound(EnemyShootFX)'					The shooting sound effect is played when the enemy shoots.
					Endif
				Next
				
				For Local EnemyProjectile:PlayerProjectile = Eachin enemyProjectiles' A for loop for each projectile in the enemy projectile class list:
					EnemyProjectile.Update()'										  Update method of the playerprojectile class is called LINE: 859
					If EnemyProjectile.TileCollision = True Then enemyProjectiles.Remove EnemyProjectile'If the tile collision for the class is true, when the projectile hits a wall, the projectile is deleted.
					
					If RectangleOverlap(EnemyProjectile.Position.x, EnemyProjectile.Position.y,8,8,player.Position.x-16,player.Position.y-16,32,32)'When the area between the enemyprojectile and player overlap, 
						enemyProjectiles.Remove EnemyProjectile'																					the projectile is deleted and the player takes damage.
						player.playerCurHealth = player.playerCurHealth - 1
					Endif
				Next
					
				
				PlayerEnemyHitDetection()'An additional method LINE: 528
				
				
				If map.LoadNew = True'When the load new boolean variable of the map class is true, a new room is being set up for load
					For Local Door:Door = Eachin doors'									The door of the current room is removed
						doors.Remove Door
					Next
					map.CreateMap()'													The function create map loads the next map
					SetWalls()'															The function setwalls creates and loads objects designated my createmap LINE: 508
					player.SetPosition(SCREEN_WIDTH/2,SCREEN_HEIGHT*14/16)'				The player position is set to the begining of the new room
				End
				If enemies.Count = 0 And enemies2.Count = 0 And map.RoomCounter <> 11' This is a lock check; when all enemies have been eliminated, the door is open.
					For Local Door:Door = Eachin doors
						Door.Lock = False
					Next
				Endif

				For Local Door:Door = Eachin doors' This is a check to see if the player has entered the door.
					If Door.Lock = True And RectangleOverlap(player.Position.x-16,player.Position.y,32,32,Door.Position.x,Door.Position.y,32,32)' If door is locked and the player walks to the door-
						player.Velocity.y = 0
						player.Position.y = player.Position.y+1'																				  The player is denied passage, the door acts like a normal tile.
						
						
					Elseif Door.Lock = False And RectangleOverlap(player.Position.x-16,player.Position.y,32,32,Door.Position.x,Door.Position.y,32,32)' If the door is unlocked and the player walks to the door, a new room to be loaded is being set up.
						PlaySound(NextLevelFX)'																										   A charm sound effect is played to signify the player has completed the level
						For Local Block:Block = Eachin blocks'																						   All tiles in the current map are removed to leave way for a new set of tiles.
							blocks.Remove Block
						Next
						map.RoomCounter = map.RoomCounter + 1'																						   The map tracker is incremented to represented the player has travelled to the next room.
						map.LoadNew = True'																										       Map load is true, signalling the creation of a new map. See LINE: 174
						If map.RoomCounter = 11 Then GameState = STATE_BOSS'																		   If the counter is 11, the player has traversed a total of 10 levels and is on the 11th level, the boss stage-
						'																															   Thus the gamestate progresses to the boss level.
					Endif
				Next 
				
				If player.playerCurHealth <= 0 Then GameState = STATE_GAMEOVER'	When player HP reaches 0, the player character is eliminated and it is gameover.
				'SHORTCUTS
				'If KeyHit(KEY_E) Then GameState = STATE_BOSS' A shortcut used for testing to skip to the boss stage
				'If KeyHit(KEY_BACKSPACE) Then GameState = STATE_GAMEOVER
				If KeyHit(KEY_ESCAPE) Then Reset()'			 A shortcut to reset the game

			Case STATE_BOSS'								Game state boss, all the code relevant to the boss fight; much of the code is repeated from the previous section thus the previous section will be referenced in the explanation.
				
				map.RoomCounter = 11'						Game room is set to level 11, the boss stage.
				If map.LoadNew = True'						Load New is true, it follows a similar routine as before, removing all objects to leave way for new objects.
						For Local Door:Door = Eachin doors
							doors.Remove Door
						Next
						For Local Block:Block = Eachin blocks
							blocks.Remove Block
						Next
						For Local Enemy:Enemy = Eachin enemies
							enemies.Remove Enemy
						Next
						For Local Enemy2:Enemy2 = Eachin enemies2
							enemies2.Remove Enemy2
						Next
						For Local PlayerProjectile:PlayerProjectile = Eachin playerProjectiles
							playerProjectiles.Remove PlayerProjectile
						Next
						For Local EnemyProjectile:PlayerProjectile = Eachin enemyProjectiles
							enemyProjectiles.Remove EnemyProjectile
						Next
						boss.AddLast(New Boss(SCREEN_WIDTH/2,SCREEN_HEIGHT/4,100,"E"))'	A new boss object class is created, the boss is created given the start position in the centre of the screen, looking to the right.
						map.CreateMap()'												Create map function is used to load the level 11 layout into the 2D array. LINE: 1353
						SetWalls()'														The objects for this level are loaded
						player.SetPosition(SCREEN_WIDTH/2,SCREEN_HEIGHT*14/16)'			Player position is set to the bottom centre of the screen.
				End
			
				player.Update()'	Player Update method called LINE: 695
				
				If player.NewProjectile = 60' This is the projectile ability code explained back on LINE: 88
					'PlaySound(ShootFX)
					playerProjectiles.AddLast(New PlayerProjectile(player.Position.x,player.Position.y,player.Direction,2,True))
				End
				
				If player.MeleeAttack = True' This is the melee ability code explained back on LINE: 112 However it has been tweaked to recognise an attack from the player on the boss.
					'PlaySound(MeleeFX)'	  The boss is a 64x64 sprite, due to limitations the rectangle overlap is used four times of 32x32 area to cover the entire boss.
					For Local Boss:Boss = Eachin boss
						If player.Direction = "E"' When the player is facing right, if the boundaries of the left side of the boss overlap the melee hit box, the boss takes damage.
							If RectangleOverlap(Boss.Position.x,Boss.Position.y,32,32,player.Position.x,player.Position.y-16,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x+32,Boss.Position.y,32,32,player.Position.x,player.Position.y-16,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x,Boss.Position.y+32,32,32,player.Position.x,player.Position.y-16,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x+32,Boss.Position.y+32,32,32,player.Position.x,player.Position.y-16,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							'player.MeleeAttack = False
						Elseif player.Direction = "W"' When the player is facing left, if the boundaries of the right side of the boss overlap the melee hit box, the boss takes damage.
							If RectangleOverlap(Boss.Position.x,Boss.Position.y,32,32,player.Position.x-32,player.Position.y-16,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x+32,Boss.Position.y,32,32,player.Position.x-32,player.Position.y-16,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x,Boss.Position.y+32,32,32,player.Position.x-32,player.Position.y-16,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x+32,Boss.Position.y+32,32,32,player.Position.x-32,player.Position.y-16,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							'player.MeleeAttack = False
						Elseif player.Direction = "S"' When the player is facing down, if the boundaries of the top of the boss overlap the melee hit box, the boss takes damage.
							If RectangleOverlap(Boss.Position.x,Boss.Position.y,32,32,player.Position.x-16,player.Position.y,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x+32,Boss.Position.y,32,32,player.Position.x-16,player.Position.y,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x,Boss.Position.y+32,32,32,player.Position.x-16,player.Position.y,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x+32,Boss.Position.y+32,32,32,player.Position.x-16,player.Position.y,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							'player.MeleeAttack = False
						Elseif player.Direction = "N"' When the player is facing up, if the boundaries of the bottom of the boss overlap the melee hit box, the boss takes damage.
							If RectangleOverlap(Boss.Position.x,Boss.Position.y,32,32,player.Position.x-16,player.Position.y-32,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x+32,Boss.Position.y,32,32,player.Position.x-16,player.Position.y-32,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x,Boss.Position.y+32,32,32,player.Position.x-16,player.Position.y-32,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							If RectangleOverlap(Boss.Position.x+32,Boss.Position.y+32,32,32,player.Position.x-16,player.Position.y-32,32,32) Then Boss.bossCurHealth = Boss.bossCurHealth - 1
							'player.MeleeAttack = False
						Endif 
					Next
				Endif
				
				For Local Boss:Boss = Eachin boss' This is the boss player collision, this is exactly the same as the player enemy collision, but reused and adapted for the four times the size of the boss compared to the enemy. This compares the area of the player to the four areas of the boss.
					If PlayerEnemyCollision(1,0,Boss.Position.x,Boss.Position.y) Or PlayerEnemyCollision(-1,0,Boss.Position.x,Boss.Position.y) Or PlayerEnemyCollision(0,1,Boss.Position.x,Boss.Position.y) Or PlayerEnemyCollision(0,-1,Boss.Position.x,Boss.Position.y) Or
					   PlayerEnemyCollision(1,0,Boss.Position.x+32,Boss.Position.y) Or PlayerEnemyCollision(-1,0,Boss.Position.x+32,Boss.Position.y) Or PlayerEnemyCollision(0,1,Boss.Position.x+32,Boss.Position.y) Or PlayerEnemyCollision(0,-1,Boss.Position.x+32,Boss.Position.y) Or
					   PlayerEnemyCollision(1,0,Boss.Position.x,Boss.Position.y+32) Or PlayerEnemyCollision(-1,0,Boss.Position.x,Boss.Position.y+32) Or PlayerEnemyCollision(0,1,Boss.Position.x,Boss.Position.y+32) Or PlayerEnemyCollision(0,-1,Boss.Position.x,Boss.Position.y+32) Or
					   PlayerEnemyCollision(1,0,Boss.Position.x+32,Boss.Position.y+32) Or PlayerEnemyCollision(-1,0,Boss.Position.x+32,Boss.Position.y+32) Or PlayerEnemyCollision(0,1,Boss.Position.x+32,Boss.Position.y+32) Or PlayerEnemyCollision(0,-1,Boss.Position.x+32,Boss.Position.y+32)  
						player.playerCurHealth = player.playerCurHealth - 1'	If the boundaries of these areas overlap, the player is moved backwards and takes damage.
						'PlaySound(MeleeFX)
						If player.Direction = "N"'										If the player is facing up
							player.SetPosition(player.Position.x, player.Position.y+5)' the player is pushed downwards
							If player.PlayerTileCollision(0,1)'							and if the bottom of the player collides with a wall
								player.playerCurHealth = 0'								the player is eliminated to simulate the character being crushed.
							Endif
						Elseif player.Direction = "S"'									If the player is facing down
							player.SetPosition(player.Position.x, player.Position.y-5)' the player is pushed upwards
							If player.PlayerTileCollision(0,-1)'						and if the top of the player collides with a wall
								player.playerCurHealth = 0'								the player is eliminated to simulate the character being crushed.
							Endif
						Elseif player.Direction = "E"'									If the player is facing right
							player.SetPosition(player.Position.x-5, player.Position.y)' the player is pushed to the left
							If player.PlayerTileCollision(1,0)'							and if the left of the player collides with a wall
								player.playerCurHealth = 0'								the player is eliminated to simulate the character being crushed.
							Endif
						Elseif player.Direction = "W"'									If the player is facing left
							player.SetPosition(player.Position.x+5, player.Position.y)' the player is pushed to the right
							If player.PlayerTileCollision(-1,0)'						and if the right of the player collides with a wall
								player.playerCurHealth = 0'								the player is eliminated to simulate the character being crushed.
							Endif
						Endif
					End if
				Next
				
				For Local Boss:Boss = Eachin boss'	The boss update method is called upon, LINE: 1173
					Boss.Update()
				Next
				
				For Local Boss:Boss = Eachin boss'	This section is to differentiate the phase mechanic of the boss.
					If Boss.bossCurHealth >= 50'	Phase 1 is when the boss's HP is above 50 points, Boss.shoot is a similar variable algorithm used by enemy2.
						If Boss.Position.y+64 < player.Position.y-16 And Boss.Shoot'	The same algorithm for the enemy 2 is used here for the boss's shooting algorithm, see LINES: 143-150
							PlaySound(EnemyShootFX) '									Sound effect for shooting a projectile is played when the boss shoots.
							enemyProjectiles.AddLast(New PlayerProjectile(Boss.Position.x+32, Boss.Position.y+32,"S",4,False))' Except rather using the attribute of direction from the boss, the direction is manually written in the parameter
							Boss.Shoot = False
						Elseif Boss.Position.y > player.Position.y+16 And Boss.Shoot
							PlaySound(EnemyShootFX) 
							enemyProjectiles.AddLast(New PlayerProjectile(Boss.Position.x+32, Boss.Position.y+32,"N",4,False))
							Boss.Shoot = False
						Else
							If Boss.Position.x+32 < player.Position.x-16 And Boss.Shoot 
								PlaySound(EnemyShootFX)
								enemyProjectiles.AddLast(New PlayerProjectile(Boss.Position.x+32, Boss.Position.y+32,"E",4,False))
								Boss.Shoot = False
							Elseif Boss.Position.x+32 > player.Position.x-16 And Boss.Shoot
								PlaySound(EnemyShootFX) 
								enemyProjectiles.AddLast(New PlayerProjectile(Boss.Position.x+32, Boss.Position.y+32,"W",4,False))
								Boss.Shoot = False
							Endif
						Endif
					Else 
						If Boss.Shoot'					When the boss's HP is less than 50 points, the boss shoots projectiles in all four directions, hence four additions of projectiles.
							PlaySound(EnemyShootFX)'	Sound effect for shooting a projectile is played when the boss shoots.
							enemyProjectiles.AddLast(New PlayerProjectile(Boss.Position.x+32, Boss.Position.y+32,"N",4,False))
							enemyProjectiles.AddLast(New PlayerProjectile(Boss.Position.x+32, Boss.Position.y+32,"E",4,False))
							enemyProjectiles.AddLast(New PlayerProjectile(Boss.Position.x+32, Boss.Position.y+32,"S",4,False))
							enemyProjectiles.AddLast(New PlayerProjectile(Boss.Position.x+32, Boss.Position.y+32,"W",4,False))
							Boss.Shoot = False
						Endif
					Endif
					
					If Boss.Charge'	This is a boolean variable for the second ability for the boss.
						Boss.Speed = 3'	The ability increases the speed of the boss as it charges.
						If Boss.Position.y+32 < player.Position.y-16' This is the same face tracking algorithm used by enemy2 (LINES: 143-150) to change direction when charge is true to face the player. 
							Boss.Direction = "S"
						Elseif Boss.Position.y > player.Position.y+16
							Boss.Direction = "N"
						Else
							If Boss.Position.x+16 < player.Position.x-16
								Boss.Direction = "E"
							Elseif Boss.Position.x+16 > player.Position.x-16
								Boss.Direction = "W"
							Endif 
						Endif
						
					Elseif Boss.Charge = False' When the charge is on cooldown, the speed of the boss is set back to 1.
						Boss.Speed = 1
					Endif
					
					If Boss.bossCurHealth <= 0 Then boss.Remove Boss' Just like the player, when the boss's HP reaches 0, it is eliminated. It is removed from the class list.
						
					Boss.Update()' Boss update method is called upon LINE: 1173
				Next
				
				For Local EnemyProjectile:PlayerProjectile = Eachin enemyProjectiles' See LINES: 160-167
					EnemyProjectile.Update()
					If EnemyProjectile.TileCollision = True Then enemyProjectiles.Remove EnemyProjectile
					
					If RectangleOverlap(EnemyProjectile.Position.x, EnemyProjectile.Position.y,8,8,player.Position.x-16,player.Position.y-16,32,32)
						enemyProjectiles.Remove EnemyProjectile
						player.playerCurHealth = player.playerCurHealth - 1
					Endif
				Next
				
				For Local PlayerProjectile:PlayerProjectile = Eachin playerProjectiles' See LINES: 95-97
					PlayerProjectile.Update()
					If PlayerProjectile.TileCollision = True Then playerProjectiles.Remove PlayerProjectile
					For Local Boss:Boss = Eachin boss' As explained prior, due to the fourtimes the size of the boss, the overlap method is used four times per 32x32 square of the boss. 
						If RectangleOverlap(Boss.Position.x,Boss.Position.y,32,32,PlayerProjectile.Position.x,PlayerProjectile.Position.y,8,8) Or'	If collision is true then the boss takes damage.
						   RectangleOverlap(Boss.Position.x+32,Boss.Position.y,32,32,PlayerProjectile.Position.x,PlayerProjectile.Position.y,8,8) Or
						   RectangleOverlap(Boss.Position.x,Boss.Position.y+32,32,32,PlayerProjectile.Position.x,PlayerProjectile.Position.y,8,8) Or
						   RectangleOverlap(Boss.Position.x+32,Boss.Position.y+32,32,32,PlayerProjectile.Position.x,PlayerProjectile.Position.y,8,8)
							playerProjectiles.Remove PlayerProjectile
							Boss.bossCurHealth = Boss.bossCurHealth - 10
						End If
					Next
				End
				
				If player.playerCurHealth <= 0 Then GameState = STATE_GAMEOVER' The player loses when the player HP is 0, the state is sent to game over
				If boss.Count = 0 Then GameState = STATE_END'					The player wins when the Boss is eliminated, this is checked when the boss list is 0 (empty) thus the player is sent to the victory screen.
				'SHORTCUTS
				'If KeyHit(KEY_E) Then GameState = STATE_END
				'If KeyHit(KEY_BACKSPACE) Then GameState = STATE_GAMEOVER
				If KeyHit(KEY_ESCAPE) Then Reset()
			
			Case STATE_END'																The end state works exactly like the intro state.
				If KeyHit(KEY_LMB) Then EndCutsceneCounter = EndCutsceneCounter + 1'	See LINES: 77-79
				If EndCutsceneCounter >= EndFrames.Length
					EndCutsceneCounter = EndFrames.Length
					Reset()'															Instead of changing the game state to game, the reset method is called, LINE: 576
				Endif
				'SHORTCUTS
				'If KeyHit(KEY_E) Then Reset()
			 
			Case STATE_GAMEOVER'														This is the state when the player loses:
				For Local Boss:Boss = Eachin boss'										Many objects are removed to leave way for a newly reset game.
					boss.Remove Boss
				Next
				For Local Enemy:Enemy = Eachin enemies
					enemies.Remove Enemy
				Next
				For Local Enemy2:Enemy2 = Eachin enemies2
					enemies2.Remove Enemy2
				Next
			
				'SHORTCUTS
				If KeyHit(KEY_LMB) Then Reset()'										LMB is used to continue via the reset method, LINE: 576
		End
	End
	
	Method OnRender()'																						RENDER: All the graphics of the game takes place here
		Cls(0,0,0)'								Background colour is set to black
		Select GameState
			Case STATE_MENU'					All the graphics rendered in the menu state.
				DrawText("Menu", 320, 100, 0.5)'The menu state is stated on the screen.
				menu.Draw()'					The menu class's draw method is called, LINE: 620
			
			Case STATE_INTRO'									All the graphics rendered in the intro cutscene.
				Local LMB:Image = LoadImage("LMB.png",32,32,1)' The Left mouse button symbol is loaded into LMB
				DrawImage(LMB,0,0)'								The image is drawn on the top left corner of the screen.
				DrawText(IntroCutsceneCounter + " " + IntroFrames[IntroCutsceneCounter], 320, 100, 0.5)'The text in the intro list is drawn on the centre of the screen using the counter as an index.
			
			Case STATE_GAME																'All the graphics rendered in the game state.
				Cls(64,32,32)'															 The background colour is set to a dark red.
				For Local Block:Block = Eachin blocks'									 All block tiles are drawn. LINE: 1335
					Block.Draw()
				End 
				For Local Door:Door = Eachin doors'										 The door is drawn. LINE: 1319
					Door.Draw()
				End
				For Local Enemy:Enemy = Eachin enemies'									 All the enemy objects are drawn. LINE: 954
					Enemy.Draw()
				End
				For Local Enemy2:Enemy2 = Eachin enemies2'								 All the enemy2 objects are drawn. LINE: 1052
					Enemy2.Draw()
				End
				For Local EnemyProjectile:PlayerProjectile = Eachin enemyProjectiles'	 All enemy projectiles are drawn. LINE: 916
					EnemyProjectile.Draw()
				Next
				For Local PlayerProjectile:PlayerProjectile = Eachin playerProjectiles'	 All player projectiles are drawn. LINE: 916
					PlayerProjectile.Draw()
				End
				If Death = False'			Death is a variable to designate whether the player has been eliminated or not, if false the player is still alive.
					player.Draw()'			Thus the player should still be drawn.
					SetColor 255,255,255'	The color is set to white so no shade is applied to the images.
					'DrawText("Game Room: "+map.RoomCounter, 320, 100, 0.5)'To be delted; testing purpose
				Elseif Death = True'		When true, the player is dead.
					SetColor 255,0,0'		The colour is set to red with text saying the player is dead on the centre of the screen.
					DrawText("YOU DIED", SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 1)
					SetColor 255,255,255
				End if
			
			Case STATE_BOSS'															All the graphics rendered on the boss stage.
				
				For Local Block:Block = Eachin blocks'									Blocks are drawn just as before. LINE: 916
					Block.Draw()
				End
				For Local EnemyProjectile:PlayerProjectile = Eachin enemyProjectiles'	Projectiles are drawn just as before. LINE: 916
					EnemyProjectile.Draw()
				Next
				For Local PlayerProjectile:PlayerProjectile = Eachin playerProjectiles'	Projectiles are drawn just as before. LINE: 916
					PlayerProjectile.Draw()
				End
				 
				For Local Boss:Boss = Eachin boss' The boss object is drawn. LINE: 1141
					Boss.Draw()
				Next
				
				If Death = False											'This section is exactly the same as before, see LINES: 456 - 464
					player.Draw()
				Elseif Death = True
					SetColor 255,0,0
					DrawText("YOU DIED", SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 1)
					SetColor 255,255,255
				End if
				
				'DrawText("Boss " + map.RoomCounter, 320, 100, 0.5)'Text to state the stage is the boss level.
			
			Case STATE_END'																			This section is exactly the same as the intro state, tweaked for the end list cutscene.
				Local LMB:Image = LoadImage("LMB.png",32,32,1)'										See LINES: 431 - 434
				DrawImage(LMB,0,0)
				DrawText(EndCutsceneCounter + " " + EndFrames[EndCutsceneCounter], 320, 100, 0.5)
			
			Case STATE_GAMEOVER'														All the graphics rendered in the gameover screen.
				Local LMB:Image = LoadImage("LMB.png",32,32,1)' See LINES: 432-433
				DrawImage(LMB,0,0)
				DrawText("Game Over", 320, 100, 0.5)'									Text drawn to tell the player game over
		End
	End
'ADDITIONAL METHODS

	Method SetWalls()'																This function loads and creates objects into the game, positions given by the layout 2D array in (y,x)
		For Local y=0 Until SCREEN_HEIGHT/TILE_SIZE'								The y value goes up until the height of the screen divided by tile size. = 20
		For Local x=0 Until SCREEN_WIDTH/TILE_SIZE'									The x value goes up until the width of the screen divided by tile size. = 15
			If map.Layout[y][x] = 1'												When the index coordinates of (y,x) is 1,
				blocks.AddLast(New Block(x*TILE_SIZE,y*TILE_SIZE))'					A tile object is created in that location.
			Elseif map.Layout[y][x] = 3'											When the index coordinates of (y,x) is 3,
				enemies.AddLast(New Enemy(x*TILE_SIZE, y*TILE_SIZE,"N"))'			A ememy object is created in that location facing up.
			Elseif map.Layout[y][x] = 4'											When the index coordinates of (y,x) is 4,
				enemies.AddLast(New Enemy(x*TILE_SIZE, y*TILE_SIZE,"W"))'			A enemy object is created in that location facing down.
			Elseif map.Layout[y][x] = 5'											When the index coordinates of (y,x) is 5,
				enemies2.AddLast(New Enemy2(x*TILE_SIZE, y*TILE_SIZE, "W"))'		A enemy2 object is created in that location facing left.
			Elseif map.Layout[y][x] = 2'											When the index coordinates of (y,x) is 2,
				doors.AddLast(New Door(x*TILE_SIZE, y*TILE_SIZE,True))'				A door is created in that location.
			End If
		Next
		Next
		map.LoadNew = False'			Once all the limits of the x and y values have been run through, the map load is set to false as the map has now been loaded.
		
	End
	'COMBAT METHODS
	Method PlayerEnemyHitDetection()'	This is the hit detection code when the player collides with the enemy, this is used to push the player back and eliminate the player if the player collides with the wall.
		'CHARGER ENEMY																	
		For Local Enemy:Enemy = Eachin enemies'	If the collision for any combination is true, all four sides of a enemy LINE: 556
			If PlayerEnemyCollision(1,0,Enemy.Position.x,Enemy.Position.y) Or PlayerEnemyCollision(-1,0,Enemy.Position.x,Enemy.Position.y) Or PlayerEnemyCollision(0,1,Enemy.Position.x,Enemy.Position.y) Or PlayerEnemyCollision(0,-1,Enemy.Position.x,Enemy.Position.y) 
				player.playerCurHealth = player.playerCurHealth - 1'			The player takes damage during any collision from any side as it collides with the enemy.
				If player.Direction = "N"'										If the player if facing up and is colliding with an enemy:
					player.SetPosition(player.Position.x, player.Position.y+3)'	player character is pushed down,
					If player.PlayerTileCollision(0,1)'							if the bottom of player collides with a wall,
						player.playerCurHealth = 0'								player is eliminated by crushing.
					Endif
				Elseif player.Direction = "S"'										If the player if facing down and is colliding with an enemy:
					player.SetPosition(player.Position.x, player.Position.y-3)'		player character is pushed up,
					If player.PlayerTileCollision(0,-1)'							if the top of player collides with a wall,
						player.playerCurHealth = 0'									player is eliminated by crushing.
					Endif
				Elseif player.Direction = "E"'										If the player if facing right and is colliding with an enemy:
					player.SetPosition(player.Position.x-3, player.Position.y)'		player character is pushed left,
					If player.PlayerTileCollision(1,0)'								if the left of player collides with a wall,
						player.playerCurHealth = 0'									player is eliminated by crushing.
					Endif
				Elseif player.Direction = "W"'										If the player if facing left and is colliding with an enemy:
					player.SetPosition(player.Position.x+3, player.Position.y)'		player character is pushed right,
					If player.PlayerTileCollision(-1,0)'							if the right of player collides with a wall,
						player.playerCurHealth = 0'									player is eliminated by crushing.
					Endif
				Endif
			End if
		Next
		
		
	End 
	Method PlayerEnemyCollision:Bool(x1:Int=0, y1:Int=0,EnemyPositionX:Int,EnemyPositionY:Int)'	This is the enemy and player directional collision method ( 0,1 = bottom, 0,-1 = top, -1,0 = right, 1,0 = left )
		Local colx = (EnemyPositionX + x1) / TILE_SIZE' Position in which a side of a object is represented in the y-axis.
		Local coly = (EnemyPositionY + y1) / TILE_SIZE' Position in which a side of a object is represented in the x-axis
		For Local y2 = coly-1 Until coly+2'	A boundary is created as a buffer of the side stated.
		For Local x2 = colx-1 Until colx+2
			If RectangleOverlap(EnemyPositionX + x1, EnemyPositionY + y1, 32, 32, player.Position.x-16, player.Position.y-16,32,32) = True' Rectangle overlap is to determin if any of those sides collide with a rectangle of another object, LINE: 570
				Return True 'If true, this method returns true for that side of the object, 
			End If
		Next
		Next
		
		Return False'		 else if there is no collision on that side nothing is returned.
	End 
	
	Method RectangleOverlap:Bool(x1:Int, y1:Int, width:Int, height:Int, x2:Int, y2:Int, width2:Int, height2:Int)' Rectangle overlap compares the sides of two rectangles if they overlap:
		If x1 >= (x2 + width2) Or (x1 + width) <= x2 Then Return False' 										  if the right side of objects 1 is greater than left side of object 2 or left side of object 1 is less than the right side of object 2 - no collision, collision is false.
    	If y1 >= (y2 + height2) Or (y1 + height) <= y2 Then Return False' 										  if the top of object 1 is under the bottom of object 2 or bottom of object 1 is above the top of object 2 - no collision, collision is false.
    	Return True' 																							  else if there is no non-colliding objects then there is a collision thus collision is true.
    End
    
    Method Reset() 'RESET: method to reset the game to a new edition for a fresh run.
    
    	For Local Block:Block = Eachin blocks' all block objects from the map is removed.
			blocks.Remove Block
		Next
		
    	MapCounter = 1'										Level counter is set back to 1
    	IntroCutsceneCounter = 0'							Cutscene counter for both cutscenes are set to the beginning
    	EndCutsceneCounter = 0
    	Death = False'										Player death is false, new run.
    	menu.Selected = 0'									Menu option is 0 by default
    	menu.SplashScreen = True'							Splash screen is reenabled
    	player.playerCurSP = player.playerMaxSP'			All SP is returned to player
    	player.playerCurHealth = player.playerMaxHealth'	Player is back to max HP
    	player.Direction = "N"'								Default direction is set back to up
    	map.RoomCounter = 1'								Map level counter is set back to 1
    	map.LoadNew = True'									No map is loaded, thus a new map must be loaded is defined.
    	
    	GameState = STATE_MENU'								State is returned back to menu, first state.
    
    End
		

End '											END OF THE MAIN CLASS. SUBSEQUENT CLASSES ARE OBJECT CLASSES.


'MENU CODE
Class MenuClass'								THIS CLASS CONTAINS ALL THE CODE FOR THE MENU
	Global Menu:String[] = ["[0]","[1] New Game","[2] Options","[3] Highscores","[4]Quit"]'	string list containing all the options to display
	Global Selected:Int'																  	Selection variable to state what option the user has selected
	Global SplashScreen:Bool'																Boolean to state whether the splash screen is to be displayed or not
	
	Field mouseX:Float,mouseY:Float'														Two c-ordinate variables for position of the pointer, tracks mouse position.
	Field SplashScreenImage:Image = LoadImage("SplashScreen.png",960,640,1)'				Load image for the splash screen display.
	
	Method New()'				New menu class creation with default states.
		Selected = 0'			0 means no option has been selected.
		SplashScreen=True'		Splash screen is to be displayed on creation.
	End
	
	Field Controls:Bool = False'						Default position to display control layout is off.
	Field Cursor:Image = LoadImage("Cursor.png",8,8,1)' load a custom pointer for the menu class. follows the position of the mouse.
	Field ControlsImg:Image = LoadImage("Controls.png")'Control layout prompt is loaded.
	
	Method Draw()'																	ALL THE CODE FOR MENU RENDERING
		SetColor 255,255,255'														Color set to white to apply no shades to images.
		If SplashScreen Then DrawImage(SplashScreenImage,-160,-80)'					If splashscreen is true, draw the splashscreen.
		If SplashScreen = False'													if splashscreen false then draw rest of the menu.
			If Selected > 0 Then DrawText("Selected: "+Menu[Selected],320,400,0.5)'	When the selection is above 0, it is used as an index to state what option has been selected.
			DrawText("1 NewGame", 320,210,0.5)'		Next couple of lines are drawing the options onto the screen the user can select.
			DrawText("2 Options", 320,260,0.5)'		They are drawn in uniform increments.
			SetColor 100,100,100
			DrawText("3 HighScores", 320,310,0.5)
			SetColor 255,255,255
			DrawText("4 Quit", 320,360,0.5)
			DrawImage(Cursor,mouseX,mouseY)'		Mouse pointer drawn at mouse position.
			SetColor(250,0,0)
			If Selected > 0 Then DrawRect(200, 160 + Selected*50, 8,8)'	A square is drawn next to the option selected to make it more clear what the user has selected.
			If Controls Then DrawImage(ControlsImg, SCREEN_WIDTH/4,0)'	If prompt for controls is true, control layout is drawn.
		End
	End
	
	Method Update()'											ALL THE UPDATE CODE FOR THE MENU CLASS
		If KeyHit(KEY_ENTER) Then SplashScreen = False'				To turn off the splashscreen and continue, user must press enter.
		If SplashScreen = False'									Menu options enabled when splashscreen is off.
			mouseX = MouseX()'										Variables for pointer position given by mouse position.
			mouseY = MouseY()
			If mouseX > (200) And mouseX < (760)'					When the x co-ordinates of the pointer is within the option boundary:
				If mouseY > 200 And mouseY < 230 Then Selected = 1'	y-axis boundaries are used to define at what region is used to
				If mouseY > 231 And mouseY < 280 Then Selected = 2' define what option the user has currently selected.
				If mouseY > 281 And mouseY < 330 Then Selected = 3'	If mouse is hovering over that region then that option is selected.
				If mouseY > 331 And mouseY < 360 Then Selected = 4
				Else Selected = 0'									If the pointer is out of bounds, nothing is selected.
			End
			If KeyHit(KEY_LMB)'						As an option has been selected, if the LMB is clicked then that selections' role is performed.
				If Selected = 1'					When option one has been selected:
					GameState = STATE_INTRO'		the game state is set to the intro cutscene and starts a new game.
				Elseif Selected = 2'				When option two has been selected:
					If Controls = True'				the control layout is displayed.
						Controls = False
					Elseif Controls = False'		If the control layout is already being displayed
						Controls = True'			then it is set to no longer display it.
					Endif
				Elseif Selected = 4'				if option four is selected then
					SplashScreen = True'			all variables of the menu state is set to the default position.
					Controls = False
				Endif	
			End
		End 
	End
		
End
'PARENT CLASS															PLAYER CLASS
Class Player
	
	Const PLAYER_WIDTH = 32'		constant for player width and height.
	Const PLAYER_HEIGHT = 32
	Field playerSpeed:Float'		player speed variable
	Field playerMaxHealth:Int'		player maximum health point.
	Field playerCurHealth:Float'	player current health point count.
	Field playerMaxSP:Int'			player maximum skill point.
	Field playerCurSP:Float'		player current skill point count.
	
	Field OriginalPos:Vec2D'		Position and vector variables that relies on the Vec2D class, LINE: 1286
	Field Position:Vec2D
	Field Velocity:Vec2D
	
	Field Speed:Float = 1'			Default speed is 1 px per refresh
	
	Field Direction:String'			Direction variable for the direction the player is facing.
	
	Field Sprite:Image = LoadImage("PlayerSouth.png",32,32,1)'	Static player sprite is loaded.

	
	Method New(x:Float,y:Float,Health:Int,SkillPoints:Int)'		Variable declaration on creation of the player object.
		OriginalPos = New Vec2D(x, y)'							Position and vector variables are given a vec2D class.
		Position = New Vec2D(x, y)
		Velocity = New Vec2D( )
		playerMaxHealth = Health'								Maximum health points given is also set for the current health count.
		playerCurHealth = playerMaxHealth
		playerMaxSP = SkillPoints'								Maximum skill points given is also set for the current skill points count.
		playerCurSP = playerMaxSP
		Direction = "N"'										Default direction is facing up.
	End 
	
	Method Update()'											PLAYER UPDATE METHOD
	
		Ability1()'	LINE: 810
		Melee()'	LINE: 826
		
		Velocity.x = 0'	X-axis velocity, default is no movement.
		Velocity.y = 0'	Y-axis velocity, default is no movement.
		
		
		If KeyDown(KEY_A) And PlayerTileCollision(-1,0) = False' If player moves left, and left side collision is false:
			Direction = "W"'									 Player direction is set to the left.
			Velocity.x = -Speed'								 Velocity is to move the player x-coordinates to the left.
		End
		If KeyDown(KEY_D) And PlayerTileCollision(1,0) = False' If player moves right, and right side collision is false:
			Direction = "E"'									Player direction is set to the right.
			Velocity.x = Speed'									Velocity is to move the player x-coordinate to the right.
		End
		If KeyDown(KEY_W) And PlayerTileCollision(0,-1) = False'	If player moves up, and top side collision is false:
			Direction = "N"'										Player direction is set to up.
			Velocity.y = -Speed'									Velocity is to move the player y-coordinate up.
		End
		If KeyDown(KEY_S) And PlayerTileCollision(0,1) = False'		If player moves down, and bottom side collision is false:
			Direction = "S"'										Player direction is set to down.
			Velocity.y = Speed'										Velocity is to move the player y-coordinate down.
		End
		
		If playerCurSP < 0 Then playerCurSP = 0'							To prevent SP from going to the negative, if it is below 0, it is set to 0.
		If playerCurSP < 100 Then playerCurSP = playerCurSP + 0.05'			Player SP is to regenerate overtime if below 100.

		SetPosition(Position.x + Velocity.x, Position.y + Velocity.y)'		Vec2D method to set position of player to move accordance to velocity.
	End
	
	Field MeleeSprite:Image = LoadImage("Strike.png",32,32,1)'	melee sprite is to represent a melee attack is loaded.
	
	Method Draw()'											PLAYER RENDER METHOD
		Bars()'												LINE: 765
		SetColor(255,255,255)'								Colour set to white to avoid shades on sprites.
		If Direction = "N"'									If player is looking up:
			Local Rotation:Int = 180'						sprite rotation variable is to rotate accordance to direction.
			DrawImage(Sprite,Position.x+16, Position.y+16,Rotation,1,1)'	Player sprite drawn, rotated to face up. Player position drawn according to hitbox.
			If MeleeAttack Then DrawImage(MeleeSprite,Position.x+16, Position.y+16-16,Rotation,1,1)' Strike animation rotated up to face up. Drawn accordance to player position.
			
		Elseif Direction = "S"'									Subsequent lines are similar to LINES: 738 - 741 but adjusted to the direction for the if statement.
			Local Rotation:Int = 0
			DrawImage(Sprite,Position.x-16, Position.y-16,Rotation,1,1)
			If MeleeAttack Then DrawImage(MeleeSprite,Position.x-16, Position.y-16+16,Rotation,1,1)
			
		Elseif Direction = "E"
			Local Rotation:Int = 90
			DrawImage(Sprite,Position.x-16, Position.y+16,Rotation,1,1)
			If MeleeAttack Then DrawImage(MeleeSprite,Position.x-16+16, Position.y+16,Rotation,1,1)
			
		Elseif Direction = "W"
			Local Rotation:Int = 270
			DrawImage(Sprite,Position.x+16, Position.y-16,Rotation,1,1)
			If MeleeAttack Then DrawImage(MeleeSprite,Position.x+16-16, Position.y-16,Rotation,1,1)
			
		Endif 
		'DrawText("Ability CoolDown: " + NewProjectile + " MeleeCoolDown: " + MeleeCoolDown,Position.x,Position.y+6)
		'If MeleeAttack Then DrawText("Attack",Position.x,Position.y)
	End
	
	Field Frame:Image = LoadImage("UI Frame.png",96,32,1)'	UI frame is the fram used to cover the player stat bars.
	
	Method Bars()'				RENDER OF VISUAL REPRESENTATION OF PLAYER STATS
		SetColor 0,0,0' 		Back ground colour for the bars set to black
		DrawRect(32,7,54,16)
	
		Local HealthBarSize:Int = 53*(playerCurHealth/playerMaxHealth)'	bar size is a percentage multiple of 53px for health bar
		Local SPBarSize:Int = 53*(playerCurSP/playerMaxSP)'	bar size is a percentage multiple of 53px for skill bar
		SetColor(200,15,15)'								Health bar is set to red and drawn
		DrawRect(32,7,HealthBarSize,6)
		SetColor(15,15,255)'								Skill bar is set to blue and drawn
		DrawRect(32,16,SPBarSize,8)
		
		SetColor 255,255,255'		Colour is set to white to avoid shading.
		DrawImage(Frame,0,0)'		Bar frame is drawn over the bars.
	End

	Method SetPosition(x:Float, y:Float)'	Set position used vec2D method, Set to set position of the player.
		Position.Set(x,y)
	End
	
	Method PlayerTileCollision:Bool(x1:Int=0, y1:Int=0)'	Similar to LINES: 556-568,
		Local colx = (Position.x-16 + x1) / TILE_SIZE'		adjusted for player tile collision, this method compares player position to tile position given from the layout 2D array.
		Local coly = (Position.y-16 + y1) / TILE_SIZE
		For Local y2 = coly-1 Until coly+2
		For Local x2 = colx-1 Until colx+2
			If x2 >= 0 And x2 < SCREEN_WIDTH/TILE_SIZE And y2 >=0 And y2 < SCREEN_HEIGHT/TILE_SIZE
				If Map.Layout[y2][x2] = 1'					This line is an addition, this is used to gather the coordinate of the tile on the map.
					If PlayerTileOverlap(Position.x-16 + x1, Position.y-16 + y1, PLAYER_WIDTH, PLAYER_HEIGHT, x2*TILE_SIZE, y2*TILE_SIZE,TILE_SIZE,TILE_SIZE) = True
						Return True 
					End If
				End If
			End If
		Next
		Next
		
		Return False
	End 
	
	Method PlayerTileOverlap:Bool(x1:Int, y1:Int, width:Int, height:Int, x2:Int, y2:Int, width2:Int, height2:Int)'Similar to LINES:570-574, adjusted for player position and tile position.
		If x1 >= (x2 + width2) Or (x1 + width) <= x2 Then Return False
    	If y1 >= (y2 + height2) Or (y1 + height) <= y2 Then Return False
    	Return True
    End
    
    Field NewProjectile:Float = 0'	This variable is a counter to state whether a new projectile can be created.
    
    Method Ability1()
    	'NewProjectile = 0
    	If NewProjectile > 0'											When projectile is above 0, it decreases by 1 per refresh.
    		NewProjectile = NewProjectile - 1
    	End If
    	If KeyHit(KEY_1) And NewProjectile <= 0 And playerCurSP >= 15'	When new projectile is 0 and the player has enough SP, 15 points atleast:
    		PlaySound(ShootFX)'											Sound for shooting a projectile is player.
    		NewProjectile = 60'											Cooldown is set to 60, which is 1 second with a 60 refresh rate.
    		playerCurSP = playerCurSP - 15'								When a projectile is shot, SP decreases by 15.
    	Endif
    	 
    End
    
    Field MeleeAttack:Bool = False'							Animation and check variable for the melee ability.
    Field MeleeCoolDown:Float = 0'							Cooldown counter variable
    
    Method Melee()
    	'MeleeCoolDown = 0
    	If MeleeCoolDown > 0'								If cooldown is above 0, the cooldown goes down by 0.2 per refresh.
    		MeleeCoolDown = MeleeCoolDown - 0.2
    	Endif 
    	If KeyHit(KEY_2) And MeleeCoolDown <= 0'			if player attack ability key pressed, and cooldown is down on 0:
    		PlaySound(MeleeFX)'								player attack sound is played.
    		MeleeCoolDown = 10'								Cooldown is set to 10
			MeleeAttack = True'								Melee attack is set to true, so player state is attack.
		Endif
		If MeleeCoolDown <= 8 Then MeleeAttack = False'		Melee attack is false after a while, this gives a window of attack.
    End
    	
End
'																		PROJECTILE CLASS
Class PlayerProjectile'							Name is now invalid due to it being used for both enemy and player classes, renaming would require renaming across several areas.
	Field Friendly:Bool'						Variable used to state whether the projectile is for the enemy or player.
	Field Direction:String'						Directional variable for movement.
	Field OriginalPos:Vec2D'					Position and vector variables using the Vec2D class.
	Field Position:Vec2D
	Field Velocity:Vec2D
	Field ProjectileSize:Int = 8'				Constant for projectile size.
	Field Speed:Int = 3'						Default speed for projectile.
	
	Field TileCollision:Bool = False'			General tile collision variable.
	
	Field Player:Image = LoadImage("PlayerProjectile.png",8,8,1)'	Player projectile sprite loaded
	Field Enemy:Image = LoadImage("EnemyProjectile.png",8,8,1)'		Enemy projectile sprite loaded
	
	Method New(x:Float,y:Float,direction:String,speed:Int,playerProjectile:Bool )'	parameters require on creation of new prjectiles:
		OriginalPos = New Vec2D(x, y)'	Vector position given from the parameters set.
		Position = New Vec2D(x, y)
		Velocity = New Vec2D()
		Direction = direction'			Direction given from the parameters set.
		Speed = speed'					Speed given from the parameters set.
		Friendly = playerProjectile'	Alliance of projectile set from parameters.
	End
	
	Method Update()'												UPDATE METHOD FOR PROJECTILE.
		Velocity.x = 0'	Default velocity is 0, however this is never the case.
		Velocity.y = 0
		
		If Direction = "W" And ProjectileTileCollision(-1,0) = False' Statements similar to player movement, if movement to the direction given and collision of that side is false:
			Velocity.x = -Speed'									  Projectile moves in that direction at the given speed.
		End
		If Direction = "E" And ProjectileTileCollision(1,0) = False
			Velocity.x = Speed
		End
		If Direction = "N" And ProjectileTileCollision(0,-1) = False
			Velocity.y = -Speed
		End
		If Direction = "S" And ProjectileTileCollision(0,1) = False
			Velocity.y = Speed
		End
		
		If ProjectileTileCollision(0,1) Or ProjectileTileCollision(0,-1) Or ProjectileTileCollision(1,0) Or ProjectileTileCollision(-1,0)'	If any collision detected:
			TileCollision = True'																											General tile collision is set to true, as stated in the main class, if true object is deleted.
		End if
		
		SetPosition(Position.x + Velocity.x, Position.y + Velocity.y)'Method to set the position of the object at the coordinates given.
	End
	
	Method SetPosition(x:Float, y:Float)'	Setposition method using the set method given by the Vec2D class.
		Position.Set(x,y)
	End
	
	Method ProjectileTileCollision:Bool(x1:Int=0, y1:Int=0)' code similar to LINES: 784-800, Adjusted for projectile position and size and tile position.
		Local colx = (Position.x-4 + x1) / TILE_SIZE
		Local coly = (Position.y-4 + y1) / TILE_SIZE
		For Local y2 = coly-1 Until coly+2
		For Local x2 = colx-1 Until colx+2
			If x2 >= 0 And x2 < SCREEN_WIDTH/TILE_SIZE And y2 >=0 And y2 < SCREEN_HEIGHT/TILE_SIZE
				If Map.Layout[y2][x2] = 1
					If ProjectileTileOverlap(Position.x-4 + x1, Position.y-4 + y1, ProjectileSize, ProjectileSize, x2*TILE_SIZE, y2*TILE_SIZE,TILE_SIZE,TILE_SIZE) = True
						Return True 
					End If
				End If
			End If
		Next
		Next
		
		Return False
	End 
	
	Method ProjectileTileOverlap:Bool(x1:Int, y1:Int, width:Int, height:Int, x2:Int, y2:Int, width2:Int, height2:Int)' Code similar to LINES: 570-574, adjusted for projectile size and position and tile position.
		If x1 >= (x2 + width2) Or (x1 + width) <= x2 Then Return False
    	If y1 >= (y2 + height2) Or (y1 + height) <= y2 Then Return False
    	Return True
    End
    
    Method Draw()'										RENDER OF THE PROJECTILE CLASS
    	SetColor 255,255,255'							Colour set to white to avoid shading.
    	If Friendly = True'								If alliance of projectile is to the player:

    		DrawImage(Player,Position.x-4,Position.y-4)'the player projectile sprite is drawn.
    	Else Friendly = False'							If alliance of projectile is to the enemy:

    		DrawImage(Enemy,Position.x-4,Position.y-4)'	the enemy projectile sprite is drawn.
    	Endif
    	'SetColor 125,125,125
    	'DrawRect(Position.x-4,Position.y-4,8,8)
    End
	
End


'SUB CLASSES FOR ROLES

'ENEMIES
																	'CHARGER :3/4
Class Enemy'														THE FIRST ENEMY CLASS WITH ID 3 AND 4.
	Field OriginalPos:Vec2D'		Position and vector variables given by Vec2D class.
	Field Position:Vec2D
	Field Velocity:Vec2D
	
	Field Speed:Float = 2'			Default speed variable.
	
	Field Direction:String'			Directional variable for movement.
	
	Method New(x:Float,y:Float,direction:String)'	Parameters to be set which is stated by the ID of the class.
		OriginalPos = New Vec2D(x, y)'				Position vector creates new vec2D class, position given by map layout.
		Position = New Vec2D(x, y)
		Velocity = New Vec2D( )
		Direction = direction'						Horizonatal or vertical direction given based on ID
	End 
	
	Field Sprite:Image = LoadImage("ChargerWest.png",32,32,2)'	Loads enemy sprite.
	
	Method Draw()'															RENDER OF ENEMY CLASS
		SetColor (255,255,255)'												colour set to white to avoid shading
		'DrawRect(Position.x,Position.y,32,32)
		If Direction = "S"'													If direction is downwards:
			Local Rotation:Int = 90'										rotation variable set accordingly to rotate image to face down.
			DrawImage(Sprite, Position.x, Position.y+32, Rotation,1,1)'		Image drawn rotated to face down and position adjusted arccodingly to the hitbox.		

		Elseif Direction = "N"'												Repeat of LINES:957-959, adjusted for the direction of the enemy.
			Local Rotation:Int = 270
			DrawImage(Sprite, Position.x+32, Position.y, Rotation,1,1)

		Elseif Direction = "W"
			Local Rotation:Int = 0
			DrawImage(Sprite, Position.x, Position.y, Rotation,1,1)

		ElseIf Direction = "E"
			Local Rotation:Int = 180
			DrawImage(Sprite, Position.x+32, Position.y+32, Rotation,1,1)
			
		Endif
	End
	
	Method Update()'													UPDATE METHOD OF ENEMY CLASS
		Velocity.x = 0'													Default velocity of class is 0.
		Velocity.y = 0
		

		'																lines similar to movement of previous classes.
		If Direction = "W" And EnemyTileCollision(-1,0) = False'		Depending on direction the enemy is facing and if collision of that side of the enemy is false:
			Velocity.x = Velocity.x-Speed'								Enemy velocity set to move in that direction.
		Elseif Direction = "E" And EnemyTileCollision(1,0) = False
			Velocity.x = Velocity.x+Speed
		Elseif Direction = "N" And EnemyTileCollision(0,-1) = False
			Velocity.y = Velocity.y-Speed
		Elseif Direction = "S" And EnemyTileCollision(0,1) = False
			Velocity.y = Velocity.y+Speed
		End
		
		If EnemyTileCollision(-1,0) And Direction = "W" Then Direction = "E"'	If the enemy collides on the left side, direction set right.
		If EnemyTileCollision(1,0) And Direction = "E" Then Direction = "W"'	if the enemy collides on the right side, direction set left.
		If EnemyTileCollision(0,1) And Direction = "S" Then Direction = "N"'	if enemy collides on the bottom, direction set up.
		If EnemyTileCollision(0,-1) And Direction = "N" Then Direction = "S"'	if enemy collides on the top, direction set down.
		
			
		

		SetPosition(Position.x + Velocity.x, Position.y + Velocity.y)'Set position to set the new coordinates of the class.
	
	End	
	Method SetPosition(x:Float, y:Float)'Use of set method from vec2D class to move enemy.
		Position.Set(x,y)
	End
	
	
	Method EnemyTileCollision:Bool(x1:Int=0, y1:Int=0)'Lines Similar to LINES:784-806, Adjusted for enemy position and tiles.
		Local colx = (Position.x + x1) / TILE_SIZE
		Local coly = (Position.y + y1) / TILE_SIZE
		For Local y2 = coly-1 Until coly+2
		For Local x2 = colx-1 Until colx+2
			If x2 >= 0 And x2 < SCREEN_WIDTH/TILE_SIZE And y2 >=0 And y2 < SCREEN_HEIGHT/TILE_SIZE
				If Map.Layout[y2][x2] = 1
					If EnemyTileOverlap(Position.x + x1, Position.y + y1, 32, 32, x2*TILE_SIZE, y2*TILE_SIZE,TILE_SIZE,TILE_SIZE) = True
						Return True 
					End If
				End If
			End If
		Next
		Next
		
		Return False
	End 
	Method EnemyTileOverlap:Bool(x1:Int, y1:Int, width:Int, height:Int, x2:Int, y2:Int, width2:Int, height2:Int)
		If x1 >= (x2 + width2) Or (x1 + width) <= x2 Then Return False
    	If y1 >= (y2 + height2) Or (y1 + height) <= y2 Then Return False
    	Return True
    End
	
End
'																				ARCHER :5
Class Enemy2'							SHOOTER ENEMY CLASS WITH ID 5
	Field OriginalPos:Vec2D'	All variables same to the previous enemy LINES: 937-950, adjusted for ID 5 of the map layout.
	Field Position:Vec2D
	Field Velocity:Vec2D
	
	Field Speed:Float = 2
	
	Field Direction:String
	
	Method New(x:Float,y:Float,direction:string)
		OriginalPos = New Vec2D(x, y)
		Position = New Vec2D(x, y)
		Velocity = New Vec2D( )
		Direction = direction
	End 
	
	Field SpriteEW:Image = LoadImage("ShooterSideWays.png",32,32,1)'Two sprites are loaded depending on the direction they are looking.
	Field SpriteNS:Image = LoadImage("ShooterVertical.png",32,32,1)
	
	Method Draw()'																RENDER METHOD FOR SHOOTER ENEMY CLASS
		SetColor (255,255,255)'													Colour set to white to avoid shading.
		'DrawRect(Position.x,Position.y,32,32)
		'DrawText(Cooldown, Position.x+8,Position.y-8)
		If Direction = "N"'														The vertical directions N and S:
			Local Rotation:Int = 0'												rotation of sprite is adjusted for the vertical sprite,
			DrawImage(SpriteNS, Position.x, Position.y, Rotation,1,1)'			appropriate sprite is drawn for the direction and position adjusted for hitbox.
			
		Elseif Direction = "S"
			Local Rotation:Int = 180 
			DrawImage(SpriteNS, Position.x+32, Position.y+32, Rotation,1,1)
			
		Elseif Direction = "W"'													The horizontal directions E and W:
			Local Rotation:Int = 180'											rotation of sprite is adjusted for the horizontal sprite,
			DrawImage(SpriteEW, Position.x+32, Position.y+32, Rotation,1,1)'	appropriate sprite is drawn for the direction and position adjusted for hitbox.

		Elseif Direction = "E"
			Local Rotation:Int = 0 
			DrawImage(SpriteEW, Position.x, Position.y, Rotation,1,1)
			

		Endif
	End
	
	Field Shoot:Bool = False'	The shoot ability has been integrated into the update method, shoot works like melee, a variable used to determine to shoot.
	Field Cooldown:Float'		Cooldown variable
	
	Method Update()'										UPDATE METHOD 
		If Cooldown > 0 Then Cooldown = Cooldown - 0.75'	If cooldown above 0, decreases by 0.75 per refresh.
		If Cooldown = 0 Then Cooldown = 60'					if cooldown is 0, then it is set to 60 where 60 means to shoot.
		If Cooldown = 60
			Shoot = True
		Elseif Cooldown < 60'								if cooldown is below 60, the enemy no longer shoots.
			Shoot = False
		Endif'												this is looped until the enemy is eliminated.
	End 
End
'																			LEVER :5
Class Lever'												ABANDONED CLASS- class not removed due to keep line references. 
	Field OriginalPos:Vec2D
	Field Position:Vec2D
	Field Velocity:Vec2D
	
	Field Direction:String
	
	Field Switch:Bool
	
	Method New(x:Float, y:Float, Direction:String)
		OriginalPos = New Vec2D(x, y)
		Position = New Vec2D(x, y)
		Velocity = New Vec2D( )
		Direction = Direction
		Switch = False
	End 
	
	Method Draw()
		SetColor(64,64,16)
	End
	
	
End
'																			BOSS
Class Boss'													BOSS ENEMY CLASS. CREATED ON BOSS STATE.
	Field bossSpeed:Float' The code of the boss is a copy and paste of the player class, See player class for uncommented code.
	Field bossMaxHealth:Int
	Field bossCurHealth:Float
	Field bossMaxSP:Int
	Field bossCurSP:Float
	
	Field OriginalPos:Vec2D
	Field Position:Vec2D
	Field Velocity:Vec2D
	
	Field Speed:Float = 1
	
	Field Direction:String
	
	Field Sprite:Image = LoadImage("Boss.png",64,64,4)' Boss sprite loaded.

	
	Method New(x:Float,y:Float,Health:Int,direction:String)
		OriginalPos = New Vec2D(x, y)
		Position = New Vec2D(x, y)
		Velocity = New Vec2D( )
		bossMaxHealth = Health
		bossCurHealth = bossMaxHealth
		Direction = direction
	End 
	
	Method Draw()'										RENDER OF BOSS ENEMY CLASS
		'SetColor (16,64,64)
		'DrawRect(Position.x,Position.y,64,64)
		'DrawText (Ability1CoolDown, Position.x-16,Position.y)
		'DrawText (Ability2CoolDown, Position.x-16,Position.y+8)
		
		
		If Direction = "N"'													The draw method for the boss uses the same code from the enemy class LINES: 955-973
			Local Rotation:Int = 180
	 		DrawImage(Sprite,Position.x+64,Position.y+64,Rotation,1,1)
	 		
		Elseif Direction = "S"
			Local Rotation:Int = 0
	 		DrawImage(Sprite,Position.x,Position.y,Rotation,1,1)
	 		
	 	Elseif Direction = "W"
	 		Local Rotation:Int = 270 
	 		DrawImage(Sprite,Position.x+64,Position.y,Rotation,1,1)
		Elseif Direction = "E"
			Local Rotation:Int = 90
	 		DrawImage(Sprite,Position.x,Position.y+64,Rotation,1,1)
		Endif	
		
		DrawHealthBar()'	Method to draw boss health bar.
	End
	
	Method DrawHealthBar()'This method is similar to how a player status bar is drawn:
		Local HealthBarSize:Float = bossCurHealth / bossMaxHealth'	Local variable stores decimal value of the percentage of health remaining.
		SetColor (200,0,0)'											HP bar colour set to red.
		DrawRect((640-(300*HealthBarSize))/2,(8*SCREEN_HEIGHT)/10, 300*HealthBarSize,3)'	Bar is drawn using a percentage multiplier of 300px. The display of the bar is similar to how status bars look in the game Skyrim.
	End
	
	Method Update()'	UPDATE METHOD OF THE BOSS CLASS
	
		Velocity.x = 0
		Velocity.y = 0
		
		
			If Direction = "W" And EnemyTileCollision(-1,0) = False'		Movement code is used exactly like the the Enemy, LINES: 982-995
				Velocity.x = Velocity.x-Speed
			Elseif Direction = "E" And EnemyTileCollision(1,0) = False
				Velocity.x = Velocity.x+Speed
			Elseif Direction = "N" And EnemyTileCollision(0,-1) = False
				Velocity.y = Velocity.y-Speed
			Elseif Direction = "S" And EnemyTileCollision(0,1) = False
				Velocity.y = Velocity.y+Speed
			End
			
			SetPosition(Position.x + Velocity.x, Position.y + Velocity.y)
			
		If Charge = False'	Charge is a check for the charge ability, the movement is normal when the ability is off.
		
			If EnemyTileCollision(-1,0) And Direction = "W" Then Direction = "E"
			If EnemyTileCollision(1,0) And Direction = "E" Then Direction = "W"
			If EnemyTileCollision(0,1) And Direction = "S" Then Direction = "N"
			If EnemyTileCollision(0,-1) And Direction = "N" Then Direction = "S"
			
		End If
		
		ChargeAttack()'LINE:1212
		Projectile()'LINE 1238
	
	End
	
	Method SetPosition(x:Float, y:Float)'Use of set method from vec2D class to move enemy.
		Position.Set(x,y)
	End
	
	Field Charge:Bool = False'			This is the check for the charge attack.
	Field Ability1CoolDown:Float = 0'	This is the cooldown counter for charge attack
	
	Method ChargeAttack()'				CHARGE ATTACK ABILITY: this ability is broken down into 2 phases.
		If bossCurHealth >= 50'			While the boss HP is above 50:
			If Ability1CoolDown > 0 Then Ability1CoolDown = Ability1CoolDown - 1'	if cooldown is more than 0, cooldown decreases by 1 per refresh
			
			If Ability1CoolDown = 0'					If cooldown = 0, then:
				Ability1CoolDown = 300'					the cooldown is clocked to 300,
				Charge = True'							the charge attack ability is triggered.
			Elseif  Ability1CoolDown <= 290'			the charge attack is give a 10 refresh window between 300-290 where it is disabled.
				Charge = False
			Endif
		Else
			If Ability1CoolDown > 0 Then Ability1CoolDown = Ability1CoolDown - 1' Similar to before but when HP is below 50 instead:
			
			If Ability1CoolDown = 0
				Ability1CoolDown = 215'											the ability cooldown is set to 215, more frequent
				Charge = True
			Elseif  Ability1CoolDown <= 190'									the window of attack is longer, 215-190. so a 25 refresh window.
				Charge = False
			Endif
		End
		 
	End
	
	Field Ability2CoolDown:Float = 0'	This is the cooldown for the shoot attack
	Field Shoot:Bool = False'			this is the check for the shoot attack
	
	Method Projectile()'				PROJECTILE SHOOT ATTACK ABILITY: this ability is broken down into 2 phases.
		If bossCurHealth >= 50'			If boss HP is above 50:
			If Ability2CoolDown > 0 Then Ability2CoolDown = Ability2CoolDown - 1'	Ability cooldown decreases by 1 per refresh above 0
			
			If Ability2CoolDown <= 0'			When cooldown is 0
				Ability2CoolDown = 40'			cooldown is set to 40
				Shoot = True'					Shoot is triggered true
			Elseif  Ability1CoolDown < 40'		When the cooldown is no longer 40, shoot is disabled so only one projectile is shot per cooldown.
				Shoot = False
			Endif
		Else'																	 When the boss HP is below 50
			If Ability2CoolDown > 0 Then Ability2CoolDown = Ability2CoolDown - 1'Code works just like before instead in the main code, boss fires in all directions.
			
			If Ability2CoolDown <= 0
				Ability2CoolDown = 40
				Shoot = True
			Elseif  Ability1CoolDown < 30
				Shoot = False
			Endif
		Endif
	
	End
	
	Method EnemyTileCollision:Bool(x1:Int=0, y1:Int=0)'	This code is similar to the players tile collision detection, LINES: 784-806
		Local colx = (Position.x + x1) / TILE_SIZE'		Adjusted for the enemy position and tiles.
		Local coly = (Position.y + y1) / TILE_SIZE
		For Local y2 = coly-1 Until coly+2
		For Local x2 = colx-1 Until colx+2
			If x2 >= 0 And x2 < SCREEN_WIDTH/TILE_SIZE And y2 >=0 And y2 < SCREEN_HEIGHT/TILE_SIZE
				If Map.Layout[y2][x2] = 1
					If EnemyTileOverlap(Position.x + x1, Position.y + y1, 64, 64, x2*TILE_SIZE, y2*TILE_SIZE,TILE_SIZE,TILE_SIZE) = True
						Return True 
					End If
				End If
			End If
		Next
		Next
		
		Return False
	End 
	Method EnemyTileOverlap:Bool(x1:Int, y1:Int, width:Int, height:Int, x2:Int, y2:Int, width2:Int, height2:Int)
		If x1 >= (x2 + width2) Or (x1 + width) <= x2 Then Return False
    	If y1 >= (y2 + height2) Or (y1 + height) <= y2 Then Return False
    	Return True
    End
	
End
'VECTORS
Class Vec2D'						This is a vector class to keep track of movement and positions.
	Field x:Float
	Field y:Float
	
	Method New(x:Float=0, y:Float=0)'	On a new class creation, the object calls on set which sets the coordinates of that object to the stated values.
		Set(x, y)
	End
	
	Method Set(x:Float, y:Float)' Set method that sets the positions of the object that calls it.
		Self.x = x
		Self.y = y
	End
End


Function Main()'		Main function, required function which is called on launch of the game.
	New DarkDungeon()'	Main class is called, creates a new game.
End


'ENVIRONMENTAL CLASSES: these classes are environmental objects for the map of the game.

Class Door'															DOOR OBJECT CLASS: this has the ID 2
	Field Open:Image = LoadImage("2.5-Open_Door.png",32,32,1)'	Image load of open door.
	Field Close:Image = LoadImage("2.0-Closed_Door.png",32,32,1)'Image load of a closed door.
	Field Position:Vec2D'										Position given by vec2D class
	Field Lock:Bool'											Lock check variable.
	
	Method New(x:Int,y:Int,Status:Bool)'						Parameters for new door object is position of door and status of the door lock.
		Position = New Vec2D(x,y)'								New vec2D class called for that position.
		Lock = Status
	End
	
	Method Draw()'									RENDER OF THE DOOR CLASS
		If Lock = False '							If lock is false then:
			DrawImage(Open, Position.x, Position.y)'A open door is drawn.
		Elseif Lock'								If lock is true then:
			DrawImage(Close, Position.x, Position.y)'A closed door is drawn.
		Endif
	End
End

Class Block'													TILE OBJECT CLASS: this has the ID 1
	Field Wall:Image = LoadImage("1.0-Wall_Middle.png",32,32,1)'Tile texture image loaded.
	Field Position:Vec2D'										Position given by Vec2D class
	Method New(x:Int,y:Int)'									New Vec2D to set position of the object.
		Position = New Vec2D(x,y)
	End
	
	Method Draw()'								RENDER OF TILE OBJECT CLASS
		DrawImage(Wall,Position.x,Position.y)'	the texture is drawn at the position of the object.
	End
	
End

Class Map'						MAP CLASS: this class is in charge of loading and creating the map.
	Field RoomCounter:Int'		This is a count variable to keep track of the room the player is on.
	Global Layout:Int[][]'		This is the 2D array used throughout the code for almost all classes.
	Field Room:String'			
	Field LoadNew:Bool'			Load room check to trigger a load of a new room.
	Field TempLayout:String[]
	
	Method New()'				When a new map class is created: A new room is loaded, default starting room is level 1.
		LoadNew = True
		RoomCounter = 1
	End
	
	Method CreateMap()'				Create map is method used to load a layout into the global 2D array.
        'Layout = New Int[15][]
        Layout = New Int[15][]'		Layout 2D array is newly created to have a blank slate to input items into the array.
        For Local i = 0 Until 15'	for loop is used to create a full 15x20 blank 2D array.
         	Layout[i] = New Int[20]'A list of 20 items is created in the slots of the first list.
        Next
        Local Room1:Int[][] = [ [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],'		This is the structure of the 2D array, a 15x20 list where the x and y values are inversed.
                   				[1,0,0,0,0,0,0,0,3,0,3,0,0,0,1,0,0,0,0,1],'		The index used is (y,x) to represent the location of an object ID in the array.
                   				[1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1],'		ID 1 = BLOCK
                   				[1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],'		ID 2 = DOOR
                    			[1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],'		ID 3/4 = ENEMY
                   				[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],'		ID 5 = ENEMY 2
                   				[1,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1],'		ID 0 = NOTHING, EMPTY SPACE.
                   				[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],                       
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   				[1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
                  				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
                  				[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]'	There are 11 locally stored 2D arrays in the class, skip to LINE: 1535
        
        Local Room2:Int[][] = [ [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
                   				[1,4,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,4,1],
                   				[1,0,0,0,0,4,1,1,1,1,1,1,1,1,4,0,0,0,0,1],
                    			[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
                   				[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
                   				[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
                   				[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],                       
                   				[1,1,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  				[1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,1],
                  				[1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,0,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]
        
        Local Room3:Int[][] = [ [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
                   				[1,0,0,3,0,3,0,3,0,3,0,3,0,3,1,0,1,0,0,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    			[1,0,0,0,0,0,0,0,3,0,3,0,3,0,3,0,3,0,0,1],
                   				[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],                       
                   				[1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,1,1,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,5,1,0,0,0,0,1],
                  				[1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
                  				[1,5,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]
        
        Local Room4:Int[][] = [ [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,3,0,5,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
                   				[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    			[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
                   				[1,5,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1],                       
                   				[1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1],
                   				[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]
        
        Local Room5:Int[][] = [ [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
                   				[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                   				[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],
                   				[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                    			[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],
                   				[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                   				[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],
                   				[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],                       
                   				[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],
                   				[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                  				[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],
                  				[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]
        
        Local Room6:Int[][] = [ [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
                   				[1,4,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,1],
                   				[1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,4,1],
                   				[1,4,0,0,0,0,1,4,0,0,0,0,0,1,0,0,0,0,0,1],
                    			[1,0,0,0,0,0,1,0,0,0,0,0,4,1,0,0,0,0,4,1],
                   				[1,4,0,0,0,0,1,4,0,0,0,0,0,1,0,0,0,0,0,1],
                   				[1,0,0,0,0,0,1,0,0,0,0,0,4,1,0,0,0,0,4,1],
                   				[1,4,0,0,0,0,1,4,0,0,0,0,0,1,0,0,0,0,0,1],                       
                   				[1,0,0,0,0,0,1,0,0,0,0,0,4,1,0,0,0,0,4,1],
                   				[1,4,0,0,0,0,1,4,0,0,0,0,0,1,0,0,0,0,0,1],
                  				[1,0,0,0,0,0,1,0,0,0,0,0,4,1,0,0,0,0,4,1],
                  				[1,4,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]
        
        Local Room7:Int[][] = [ [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                   				[1,5,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],
                   				[1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1],
                   				[1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                    			[1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
                   				[1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,1],
                   				[1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,0,0,1],
                   				[1,0,0,0,1,0,0,0,0,0,0,0,5,1,0,1,0,1,0,1],                       
                   				[1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1,0,1],
                   				[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1],
                  				[1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1],
                  				[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,5,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ] 
                  				
        Local Room8:Int[][] = [ [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
                   				[1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
                   				[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
                   				[1,0,0,0,1,3,0,0,0,0,0,0,0,0,3,1,0,0,0,1],
                    			[1,0,1,0,1,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1],
                   				[1,0,1,0,1,0,1,3,0,0,0,0,3,1,0,1,0,1,0,1],
                   				[1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1],
                   				[1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1],                       
                   				[1,0,1,0,1,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1],
                   				[1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],
                  				[1,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1],
                  				[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]
                  				
        Local Room9:Int[][] = [ [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
                   				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   				[1,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,1],
                   				[1,4,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,4,1],
                    			[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
                   				[1,0,0,0,0,0,0,0,4,1,1,0,0,0,0,0,0,0,4,1],
                   				[1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
                   				[1,4,0,0,0,0,0,0,0,1,1,4,0,0,0,0,0,0,0,1],                       
                   				[1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
                   				[1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
                  				[1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
                  				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]
                  				
        Local Room10:Int[][] = [ [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
                   				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                   				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                   				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                    			[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                   				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                   				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                   				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],                       
                   				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                   				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                  				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  ]
                  				
        Local BOSSROOM:Int[][] = [ [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                   				   [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
                   				   [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
                   				   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    			   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   				   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   				   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   				   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],                       
                   				   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   				   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  				   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  				   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  				   [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
                  				   [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
                  				   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] ]
                  				
		If RoomCounter = 1'											There is a if statement per local 2D room array- when room counter is 1.
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE'		For loop is used to go through out the entire local array and fill the global array.
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE '		Essentially this replaces the global array with a new array to represent a new level.
			Layout[y1][x1] = Room1[y1][x1]
			Next
			Next'													this code is repeated for each local 2D array.
		Elseif RoomCounter = 2
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room2[y1][x1]
			Next
			Next
		Elseif RoomCounter = 3
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room3[y1][x1]
			Next
			Next
		Elseif RoomCounter = 4
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room4[y1][x1]
			Next
			Next
		Elseif RoomCounter = 5
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room5[y1][x1]
			Next
			Next
		Elseif RoomCounter = 6
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room6[y1][x1]
			Next
			Next
		Elseif RoomCounter = 7
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room7[y1][x1]
			Next
			Next
		Elseif RoomCounter = 8
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room8[y1][x1]
			Next
			Next
		Elseif RoomCounter = 9
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room9[y1][x1]
			Next
			Next
		Elseif RoomCounter = 10
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = Room10[y1][x1]
			Next
			Next
		Elseif RoomCounter = 11
			For Local y1:Int = 0 Until SCREEN_HEIGHT/TILE_SIZE
			For Local x1:Int = 0 Until SCREEN_WIDTH/TILE_SIZE 
			Layout[y1][x1] = BOSSROOM[y1][x1]
			Next
			Next
		Endif 
	End 
End 