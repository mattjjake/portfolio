namespace LevelEditor
{
    partial class levelEditor
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(levelEditor));
            this.buttonSave = new System.Windows.Forms.Button();
            this.tileSelect = new System.Windows.Forms.ComboBox();
            this.buttonQuit = new System.Windows.Forms.Button();
            this.labelTypeDisplay = new System.Windows.Forms.Label();
            this.buttonReset = new System.Windows.Forms.Button();
            this.labelError = new System.Windows.Forms.Label();
            this.numLevel = new System.Windows.Forms.NumericUpDown();
            this.labelLevel = new System.Windows.Forms.Label();
            this.buttonLoad = new System.Windows.Forms.Button();
            this.buttonDefault = new System.Windows.Forms.Button();
            this.tileList = new System.Windows.Forms.ImageList(this.components);
            ((System.ComponentModel.ISupportInitialize)(this.numLevel)).BeginInit();
            this.SuspendLayout();
            // 
            // buttonSave
            // 
            this.buttonSave.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.buttonSave.Location = new System.Drawing.Point(847, 613);
            this.buttonSave.Margin = new System.Windows.Forms.Padding(4);
            this.buttonSave.Name = "buttonSave";
            this.buttonSave.Size = new System.Drawing.Size(136, 36);
            this.buttonSave.TabIndex = 2;
            this.buttonSave.Text = "Save";
            this.buttonSave.UseVisualStyleBackColor = true;
            this.buttonSave.Click += new System.EventHandler(this.buttonSave_Click);
            // 
            // tileSelect
            // 
            this.tileSelect.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.tileSelect.FormattingEnabled = true;
            this.tileSelect.Location = new System.Drawing.Point(33, 609);
            this.tileSelect.Margin = new System.Windows.Forms.Padding(4);
            this.tileSelect.Name = "tileSelect";
            this.tileSelect.Size = new System.Drawing.Size(201, 28);
            this.tileSelect.TabIndex = 3;
            this.tileSelect.SelectedIndexChanged += new System.EventHandler(this.tileSelect_SelectedIndexChanged);
            // 
            // buttonQuit
            // 
            this.buttonQuit.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.buttonQuit.Location = new System.Drawing.Point(847, 720);
            this.buttonQuit.Margin = new System.Windows.Forms.Padding(4);
            this.buttonQuit.Name = "buttonQuit";
            this.buttonQuit.Size = new System.Drawing.Size(136, 36);
            this.buttonQuit.TabIndex = 4;
            this.buttonQuit.Text = "Quit";
            this.buttonQuit.UseVisualStyleBackColor = true;
            this.buttonQuit.Click += new System.EventHandler(this.buttonQuit_Click);
            // 
            // labelTypeDisplay
            // 
            this.labelTypeDisplay.AutoSize = true;
            this.labelTypeDisplay.Cursor = System.Windows.Forms.Cursors.Default;
            this.labelTypeDisplay.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold);
            this.labelTypeDisplay.Location = new System.Drawing.Point(33, 571);
            this.labelTypeDisplay.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.labelTypeDisplay.Name = "labelTypeDisplay";
            this.labelTypeDisplay.Size = new System.Drawing.Size(122, 25);
            this.labelTypeDisplay.TabIndex = 5;
            this.labelTypeDisplay.Text = "Tile Select:";
            // 
            // buttonReset
            // 
            this.buttonReset.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.buttonReset.Location = new System.Drawing.Point(285, 604);
            this.buttonReset.Margin = new System.Windows.Forms.Padding(4);
            this.buttonReset.Name = "buttonReset";
            this.buttonReset.Size = new System.Drawing.Size(136, 36);
            this.buttonReset.TabIndex = 6;
            this.buttonReset.Text = "Reset";
            this.buttonReset.UseVisualStyleBackColor = true;
            this.buttonReset.Click += new System.EventHandler(this.buttonReset_Click_1);
            // 
            // labelError
            // 
            this.labelError.AutoSize = true;
            this.labelError.ForeColor = System.Drawing.SystemColors.Highlight;
            this.labelError.Location = new System.Drawing.Point(13, 13);
            this.labelError.Name = "labelError";
            this.labelError.Size = new System.Drawing.Size(0, 17);
            this.labelError.TabIndex = 7;
            // 
            // numLevel
            // 
            this.numLevel.Location = new System.Drawing.Point(543, 613);
            this.numLevel.Name = "numLevel";
            this.numLevel.Size = new System.Drawing.Size(60, 22);
            this.numLevel.TabIndex = 8;
            this.numLevel.ValueChanged += new System.EventHandler(this.numLevel_ValueChanged);
            // 
            // labelLevel
            // 
            this.labelLevel.AutoSize = true;
            this.labelLevel.Cursor = System.Windows.Forms.Cursors.Default;
            this.labelLevel.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold);
            this.labelLevel.Location = new System.Drawing.Point(453, 609);
            this.labelLevel.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.labelLevel.Name = "labelLevel";
            this.labelLevel.Size = new System.Drawing.Size(83, 25);
            this.labelLevel.TabIndex = 10;
            this.labelLevel.Text = "Level#:";
            // 
            // buttonLoad
            // 
            this.buttonLoad.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.buttonLoad.Location = new System.Drawing.Point(847, 657);
            this.buttonLoad.Margin = new System.Windows.Forms.Padding(4);
            this.buttonLoad.Name = "buttonLoad";
            this.buttonLoad.Size = new System.Drawing.Size(136, 36);
            this.buttonLoad.TabIndex = 11;
            this.buttonLoad.Text = "Load";
            this.buttonLoad.UseVisualStyleBackColor = true;
            this.buttonLoad.Click += new System.EventHandler(this.buttonLoad_Click);
            // 
            // buttonDefault
            // 
            this.buttonDefault.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.buttonDefault.Location = new System.Drawing.Point(285, 648);
            this.buttonDefault.Margin = new System.Windows.Forms.Padding(4);
            this.buttonDefault.Name = "buttonDefault";
            this.buttonDefault.Size = new System.Drawing.Size(136, 36);
            this.buttonDefault.TabIndex = 12;
            this.buttonDefault.Text = "Default";
            this.buttonDefault.UseVisualStyleBackColor = true;
            this.buttonDefault.Click += new System.EventHandler(this.buttonDefault_Click);
            // 
            // tileList
            // 
            this.tileList.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("tileList.ImageStream")));
            this.tileList.TransparentColor = System.Drawing.Color.Transparent;
            this.tileList.Images.SetKeyName(0, "tempFloor.jpg");
            this.tileList.Images.SetKeyName(1, "tempWall.png");
            this.tileList.Images.SetKeyName(2, "door.png");
            this.tileList.Images.SetKeyName(3, "wizardIcon.png");
            this.tileList.Images.SetKeyName(4, "badguyIcon.png");
            // 
            // levelEditor
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1045, 875);
            this.Controls.Add(this.buttonDefault);
            this.Controls.Add(this.buttonLoad);
            this.Controls.Add(this.labelLevel);
            this.Controls.Add(this.numLevel);
            this.Controls.Add(this.labelError);
            this.Controls.Add(this.buttonReset);
            this.Controls.Add(this.labelTypeDisplay);
            this.Controls.Add(this.buttonQuit);
            this.Controls.Add(this.tileSelect);
            this.Controls.Add(this.buttonSave);
            this.Margin = new System.Windows.Forms.Padding(4);
            this.Name = "levelEditor";
            this.Text = "Level Editor";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.numLevel)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Button buttonSave;
        private System.Windows.Forms.ComboBox tileSelect;
        private System.Windows.Forms.Button buttonQuit;
        private System.Windows.Forms.Label labelTypeDisplay;
        private System.Windows.Forms.Button buttonReset;
        private System.Windows.Forms.Label labelError;
        private System.Windows.Forms.NumericUpDown numLevel;
        private System.Windows.Forms.Label labelLevel;
        private System.Windows.Forms.Button buttonLoad;
        private System.Windows.Forms.Button buttonDefault;
        public System.Windows.Forms.ImageList tileList;
    }
}

