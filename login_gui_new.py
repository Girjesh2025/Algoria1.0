#!/usr/bin/env python3
# Simple Fyers login GUI script

import tkinter as tk
from tkinter import messagebox, ttk
import webbrowser
import datetime
import os

# You would need to install these libraries with pip install fyers-apiv2
try:
    from fyers_api import accessToken, fyersModel
    FYERS_API_AVAILABLE = True
except ImportError:
    FYERS_API_AVAILABLE = False
    print("Warning: fyers-apiv2 package not found. This script will run in simulation mode.")

# Default values - replace with your actual app credentials
DEFAULT_APP_ID = "YOUR_APP_ID"  # e.g., "ABCD-100"
DEFAULT_SECRET = "YOUR_APP_SECRET"
DEFAULT_REDIRECT_URI = "https://trade.fyers.in/api-login/redirect-uri/index.html"

class FyersLoginApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Fyers API Login Tool")
        self.root.geometry("500x600")
        self.root.resizable(False, False)
        self.root.configure(bg="#f5f5f5")
        
        self.app_id = tk.StringVar(value=DEFAULT_APP_ID)
        self.app_secret = tk.StringVar(value=DEFAULT_SECRET)
        self.redirect_uri = tk.StringVar(value=DEFAULT_REDIRECT_URI)
        self.auth_code = tk.StringVar()
        self.access_token = tk.StringVar()
        
        self.setup_ui()
        
    def setup_ui(self):
        # Title
        title_label = tk.Label(
            self.root, 
            text="Fyers API Login Tool", 
            font=("Arial", 16, "bold"),
            bg="#f5f5f5"
        )
        title_label.pack(pady=20)
        
        # Create main frame
        main_frame = tk.Frame(self.root, bg="#f5f5f5")
        main_frame.pack(fill="both", expand=True, padx=20, pady=10)
        
        # Step 1: App ID and Secret
        step1_frame = tk.LabelFrame(
            main_frame, 
            text="Step 1: App Credentials", 
            font=("Arial", 10, "bold"),
            bg="#f5f5f5",
            padx=10,
            pady=10
        )
        step1_frame.pack(fill="x", pady=10)
        
        # App ID
        tk.Label(step1_frame, text="App ID:", bg="#f5f5f5").grid(row=0, column=0, sticky="w", pady=5)
        tk.Entry(step1_frame, textvariable=self.app_id, width=40).grid(row=0, column=1, pady=5, padx=5)
        
        # App Secret
        tk.Label(step1_frame, text="App Secret:", bg="#f5f5f5").grid(row=1, column=0, sticky="w", pady=5)
        secret_entry = tk.Entry(step1_frame, textvariable=self.app_secret, width=40, show="*")
        secret_entry.grid(row=1, column=1, pady=5, padx=5)
        
        # Redirect URI
        tk.Label(step1_frame, text="Redirect URI:", bg="#f5f5f5").grid(row=2, column=0, sticky="w", pady=5)
        tk.Entry(step1_frame, textvariable=self.redirect_uri, width=40).grid(row=2, column=1, pady=5, padx=5)
        
        # Step 2: Generate Auth Code
        step2_frame = tk.LabelFrame(
            main_frame, 
            text="Step 2: Generate Auth Code", 
            font=("Arial", 10, "bold"),
            bg="#f5f5f5",
            padx=10,
            pady=10
        )
        step2_frame.pack(fill="x", pady=10)
        
        generate_button = tk.Button(
            step2_frame, 
            text="Generate Auth URL & Open Browser", 
            command=self.generate_auth_url,
            bg="#4CAF50",
            fg="white",
            padx=10
        )
        generate_button.pack(pady=10)
        
        # Step 3: Enter Auth Code
        step3_frame = tk.LabelFrame(
            main_frame, 
            text="Step 3: Enter Auth Code", 
            font=("Arial", 10, "bold"),
            bg="#f5f5f5",
            padx=10,
            pady=10
        )
        step3_frame.pack(fill="x", pady=10)
        
        tk.Label(
            step3_frame, 
            text="After authorizing in the browser, paste the auth code here:",
            bg="#f5f5f5",
            wraplength=400
        ).pack(pady=5)
        
        auth_entry = tk.Entry(step3_frame, textvariable=self.auth_code, width=50)
        auth_entry.pack(pady=5)
        
        generate_token_button = tk.Button(
            step3_frame, 
            text="Generate Access Token", 
            command=self.generate_access_token,
            bg="#2196F3",
            fg="white",
            padx=10
        )
        generate_token_button.pack(pady=10)
        
        # Step 4: Access Token
        step4_frame = tk.LabelFrame(
            main_frame, 
            text="Step 4: Access Token", 
            font=("Arial", 10, "bold"),
            bg="#f5f5f5",
            padx=10,
            pady=10
        )
        step4_frame.pack(fill="x", pady=10)
        
        token_text = tk.Entry(step4_frame, textvariable=self.access_token, width=50, state="readonly")
        token_text.pack(pady=10)
        
        save_button = tk.Button(
            step4_frame, 
            text="Save Token to File", 
            command=self.save_token,
            bg="#FFC107",
            fg="black",
            padx=10
        )
        save_button.pack(pady=5)
        
        # Status Bar
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        status_bar = tk.Label(
            self.root, 
            textvariable=self.status_var, 
            bd=1, 
            relief=tk.SUNKEN, 
            anchor=tk.W,
            bg="#e0e0e0"
        )
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
    def generate_auth_url(self):
        try:
            app_id = self.app_id.get()
            redirect_uri = self.redirect_uri.get()
            
            if not app_id or not redirect_uri:
                messagebox.showerror("Error", "App ID and Redirect URI are required")
                return
            
            # In simulation mode, we'll just show a sample URL
            if not FYERS_API_AVAILABLE:
                # Simulated URL generation
                auth_url = f"https://api.fyers.in/api/v2/generate-authcode?client_id={app_id}&redirect_uri={redirect_uri}&response_type=code"
                webbrowser.open(auth_url)
                self.status_var.set("Auth URL opened in browser (SIMULATION MODE)")
                return
            
            # For actual implementation with the Fyers API
            session = accessToken.SessionModel(
                client_id=app_id,
                secret_key=self.app_secret.get(),
                redirect_uri=redirect_uri,
                response_type="code",
                grant_type="authorization_code"
            )
            
            auth_url = session.generate_authcode()
            webbrowser.open(auth_url)
            self.status_var.set("Auth URL opened in browser")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate auth URL: {str(e)}")
            self.status_var.set("Error generating auth URL")
    
    def generate_access_token(self):
        try:
            app_id = self.app_id.get()
            app_secret = self.app_secret.get()
            redirect_uri = self.redirect_uri.get()
            auth_code = self.auth_code.get()
            
            if not app_id or not app_secret or not redirect_uri or not auth_code:
                messagebox.showerror("Error", "All fields are required")
                return
            
            # In simulation mode, we'll just generate a dummy token
            if not FYERS_API_AVAILABLE:
                # Simulated token generation
                dummy_token = f"{app_id}:SIMULATED_TOKEN_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
                self.access_token.set(dummy_token)
                self.status_var.set("Access token generated (SIMULATION MODE)")
                return
            
            # For actual implementation with the Fyers API
            session = accessToken.SessionModel(
                client_id=app_id,
                secret_key=app_secret,
                redirect_uri=redirect_uri,
                response_type="code",
                grant_type="authorization_code"
            )
            
            session.set_token(auth_code)
            response = session.generate_token()
            
            if response["status"] == "success":
                access_token = response["access_token"]
                self.access_token.set(access_token)
                self.status_var.set("Access token successfully generated")
            else:
                messagebox.showerror("Error", f"Failed to generate access token: {response['message']}")
                self.status_var.set("Error generating access token")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate access token: {str(e)}")
            self.status_var.set("Error generating access token")
    
    def save_token(self):
        token = self.access_token.get()
        
        if not token:
            messagebox.showerror("Error", "No access token to save")
            return
        
        try:
            with open("access_token.txt", "w") as f:
                f.write(token)
            
            messagebox.showinfo("Success", "Access token saved to access_token.txt")
            self.status_var.set("Access token saved to file")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save access token: {str(e)}")
            self.status_var.set("Error saving access token")

if __name__ == "__main__":
    root = tk.Tk()
    app = FyersLoginApp(root)
    root.mainloop() 