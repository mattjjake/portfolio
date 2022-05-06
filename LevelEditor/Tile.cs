using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Windows.Forms;

namespace LevelEditor
{
    // Tile type enum to set buttons to correct state
    public enum TileType
    {
        Ground,
        Enemy,
        //Rock,
        Wall,
        Door,
        Player,
    }

    class Tile
    {
        #region FIELDS
        // store button, tile type, color/display
        Button currentTile;
        TileType type;
        ImageList tiles;
        #endregion

        #region properties
        // get property to retrieve button
        public Button CurrentTile { get { return currentTile; } }

        // read only property to retrieve type
        public TileType Type { get { return type; } set { type = value; } }
        #endregion

        #region constructor
        public Tile(Button tile, TileType type, ImageList tiles)
        {
            this.currentTile = tile;
            this.type = type;
            this.tiles = tiles;
            tile.Click += new EventHandler(this.ClickHandle);
        }
        #endregion

        #region methods
        //changes tile type upon click, updates display
        protected void ClickHandle(object sender, EventArgs e)
        {
            ButtonDisplay();
        }

        // Method to set display atrributes based on tile type
        public void ButtonDisplay()
        {
            switch (type)
            {
                case TileType.Wall:
                    currentTile.BackColor = Color.CadetBlue;
                    currentTile.Image = tiles.Images[1];
                    break;

                /*case TileType.Rock:
                    currentTile.BackColor = Color.LightYellow;
                    break;*/

                case TileType.Ground:
                    currentTile.BackColor = Color.SaddleBrown;
                    currentTile.Image = tiles.Images[0];
                    break;

                case TileType.Enemy:
                    currentTile.BackColor = Color.PaleVioletRed;
                    currentTile.Image = tiles.Images[4];
                    break;

                case TileType.Door:
                    currentTile.BackColor = Color.Green;
                    currentTile.Image = tiles.Images[2];
                    break;

                case TileType.Player:
                    currentTile.BackColor = Color.Orange;
                    currentTile.Image = tiles.Images[3];
                    break;
            }
        }
        #endregion
    }
}
