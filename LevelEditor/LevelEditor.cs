using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace LevelEditor
{
    public partial class levelEditor : Form
    {
        #region Fields
        // Fields ----------------------------------------------------------------------------
        // Button grid array and size
        private Tile[,] levelGrid = new Tile[RowTiles , ColTiles];
        private const int RowTiles = 7;
        private const int ColTiles = 10;
        private const int ButtonSize = 50;
        private int level;
        //Reorganize, impliment design, quality of life changes
        #endregion

        #region Constructor
        public levelEditor()
        {
            InitializeComponent();

            // Create a placeholder in the size of the array and made editing these values
            // as easy as possible for changes to the aspect ratio

            // Add tile options to comboBox
            foreach (string s in Enum.GetNames(typeof(TileType)))
            {
                tileSelect.Items.Add(s);
            }

            //hide management controls
            labelTypeDisplay.Hide();
            tileSelect.Hide();
            buttonSave.Hide();
        }
        #endregion

        #region Methods
        // Initialize and create a grid of buttons to represent the level
        private void InitializeLevel()
        {
            levelGrid = new Tile[RowTiles, ColTiles];

            //fill each button with a nested for loop
            int x = 25;
            int y = 25;

            for (int i = 0; i < levelGrid.GetLength(0); i++)
            {
                for (int j = 0; j < levelGrid.GetLength(1); j++)
                {
                    // default encompassing walls
                    if (i == (levelGrid.GetLength(0) - 1) || i == 0
                        || j == 0 || j == (levelGrid.GetLength(1) - 1))
                    {
                        levelGrid[i, j] = new Tile(new Button(), TileType.Wall, tileList);
                        levelGrid[i, j].CurrentTile.Image = tileList.Images[1];
                    }
                    else
                    {
                        // Ground initialization
                        levelGrid[i, j] = new Tile(new Button(), TileType.Ground, tileList);
                        levelGrid[i, j].CurrentTile.Image = tileList.Images[0];
                    }
                    levelGrid[i, j].CurrentTile.Size = new Size(ButtonSize, ButtonSize);
                    levelGrid[i, j].CurrentTile.Location = new Point(x, y);
                    this.Controls.Add(levelGrid[i, j].CurrentTile);
                    x += ButtonSize + 5;

                    levelGrid[i, j].ButtonDisplay();
                }
                y += ButtonSize;
                x = 25;
            }
            tileSelect.Show();
            labelTypeDisplay.Show();
        }

        //Helps display 
        private void displayTest()
        {
            for (int i = 0; i < levelGrid.GetLength(0); i++)
            {
                for (int j = 0; j < levelGrid.GetLength(1); j++)
                {
                    levelGrid[i, j].ButtonDisplay();
                }
            }
        }
        #endregion

        #region Controls
        private void Form1_Load(object sender, EventArgs e)
        {

        }

        //tile changer which changes the default tile type that is edited via click
        private void tileSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            //parse enum
            TileType changeType = (TileType)Enum.Parse(typeof(TileType) , tileSelect.SelectedItem.ToString());
            for (int i = 0; i < levelGrid.GetLength(0); i++)
            {
                for (int j = 0; j < levelGrid.GetLength(1); j++)
                {
                    levelGrid[i,j].Type = changeType;
                }
            }
        }

        //save file with fileIO
        private void buttonSave_Click(object sender, EventArgs e)
        {
            //grab desired filename
            SaveFileDialog fileDialog = new SaveFileDialog();
            fileDialog.FileName = "level" + level + ".txt";
            fileDialog.InitialDirectory = @"Setback\Setback\bin\Windows\x86\Debug";
            fileDialog.ShowDialog();
            string fileName = fileDialog.FileName;

            //create stream
            StreamWriter output = null;

            //try catch exceptions
            try
            {
                output = new StreamWriter(fileName);
                //output.Write non-loop info
                //size of level
                output.WriteLine("{0}*{1}", levelGrid.GetLength(0), levelGrid.GetLength(1));

                //level #
                output.WriteLine(level);

                //for loop
                for (int i = 0; i < levelGrid.GetLength(0); i++)
                {
                    for (int j = 0; j < levelGrid.GetLength(1); j++)
                    {
                        //wall
                        if (levelGrid[i, j].CurrentTile.BackColor == Color.CadetBlue)
                        {
                            output.Write("w");
                        }
                        //rock
                        /*else if (levelGrid[i, j].CurrentTile.BackColor == Color.LightYellow)
                        {
                            output.Write("r");
                        }*/
                        //ground
                        else if (levelGrid[i, j].CurrentTile.BackColor == Color.SaddleBrown)
                        {
                            output.Write("e");
                        }
                        //enemy
                        else if (levelGrid[i, j].CurrentTile.BackColor == Color.PaleVioletRed)
                        {
                            output.Write("h");
                        }
                        //door
                        else if (levelGrid[i, j].CurrentTile.BackColor == Color.Green)
                        {
                            output.Write("d");
                        }
                        //player
                        else if (levelGrid[i, j].CurrentTile.BackColor == Color.Orange)
                        {
                            output.Write("p");
                        }

                        if (j != levelGrid.GetLength(1) - 1)
                        {
                            output.Write("|");
                        }
                    }
                    output.WriteLine();
                }
            }

            catch (Exception error)
            {
                labelError.Text = String.Format("Error: {0}", error.Message);
            }

            //close writer
            if (output != null)
            {
                output.Close();
            }
        }

        //close program
        private void buttonQuit_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        // if Reset is clicked, reset the board to inital by opening new forum
        private void buttonReset_Click_1(object sender, EventArgs e)
        {
            levelEditor reload = new levelEditor();
            reload.Show();
            this.Dispose(false);
        }

        private void numLevel_ValueChanged(object sender, EventArgs e)
        {
            level = (int)numLevel.Value;
        }

        //load level and reinitialize
        //LOADING WORKS --------
        private void buttonLoad_Click(object sender, EventArgs e)
        {
            OpenFileDialog fileDialog = new OpenFileDialog();
            fileDialog.ShowDialog();
            string fileName = fileDialog.FileName;

            string line = null;
            string dimensions = null;
            int count = 0;
            int x = 25;
            int y = 25;
            StreamReader input = null;
            Tile[,] newLevelGrid;

            try
            {
                //Clean this up
                input = new StreamReader(fileName);
                dimensions = input.ReadLine();
                string[] rowCol = dimensions.Split('*');
                int rowTiles = int.Parse(rowCol[0]);
                int colTiles = int.Parse(rowCol[1]);
                newLevelGrid = new Tile[rowTiles, colTiles];

                level = int.Parse(input.ReadLine());

                while ((line = input.ReadLine()) != null)
                {
                    string[] data = line.Split('|');
                    for (int i = 0; i < data.Length; i++)
                    {
                        string type = data[i];

                        //reference another swc?
                        switch (type)
                        {
                            case "w":
                                newLevelGrid[count, i] = new Tile(new Button(), TileType.Wall, tileList);
                                break;

                            /*case "r":
                                newLevelGrid[count, i] = new Tile(new Button(),TileType.Rock, tileList);
                                break;*/

                            case "e":
                                newLevelGrid[count, i] = new Tile(new Button(), TileType.Ground, tileList);
                                break;

                            case "h":
                                newLevelGrid[count, i] = new Tile(new Button(), TileType.Enemy, tileList);
                                break;

                            case "p":
                                newLevelGrid[count, i] = new Tile(new Button(), TileType.Player, tileList);
                                break;

                            case "d":
                                newLevelGrid[count, i] = new Tile(new Button(), TileType.Door, tileList);
                                break;
                        }
                        newLevelGrid[count, i].CurrentTile.Size = new Size(ButtonSize, ButtonSize);
                        newLevelGrid[count, i].CurrentTile.Location = new Point(x, y);
                        this.Controls.Add(newLevelGrid[count, i].CurrentTile);
                        x += ButtonSize + 5;

                        newLevelGrid[count, i].ButtonDisplay();
                    }
                    y += ButtonSize;
                    x = 25;
                    count++;
                }
                this.levelGrid = newLevelGrid;
                displayTest();

                //Show tile management controls
                tileSelect.Show();
                labelTypeDisplay.Show();
                buttonSave.Show();

                //hide load controls
                buttonDefault.Hide();
                buttonLoad.Hide();
            }

            catch (Exception error)
            {
                    labelError.Text = String.Format("Error: {0}", error.Message);
            }

            if (input != null)
            {
                input.Close();
            }
        }

        //loads the default board, empty room
        private void buttonDefault_Click(object sender, EventArgs e)
        {
            InitializeLevel();

            //hide load controls
            buttonLoad.Hide();
            buttonDefault.Hide();

            //show management controls
            buttonSave.Show();
        }
        #endregion
    }
}