import java.net.Socket;
import java.net.ServerSocket;
import java.io.*;
import java.util.StringTokenizer;

class GameServer {
	
	private static int ballX;
	private static int ballY;
	
    public static void main(String[] args) throws Exception {
        System.out.println("Connecting to server...");
		ServerSocket server = new ServerSocket(8080);
		
		while(true) {
			try {
				// System.out.println("Listening to client...");
				Socket s = server.accept();
				// System.out.println("Client accepted, sending greeting.");
				// s.getOutputStream().write("Who are you\n".getBytes());
				// s.getOutputStream().flush();
				
				byte[] request = new byte[10000];
				int number = s.getInputStream().read(request);
				String contentFromClient = new String(request, 0, number);
				
				if (contentFromClient.startsWith("POST")) {
					System.out.println("Client said: ");
									
					StringTokenizer st = new StringTokenizer(contentFromClient, "\n");
					
					// read the headers first
					String token = st.nextToken();
					while(token.trim().length() != 0) {
						System.out.println("next: " + token);
						System.out.println("length: " + token.length());
						token = st.nextToken();
					}
					
					String actualContent = st.nextToken();
					// System.out.println(actualContent);
					
					StringTokenizer st2 = new StringTokenizer(actualContent, "/");
					String xstr = st2.nextToken();
					String ystr = st2.nextToken();
					ballX = Integer.parseInt(xstr);
					ballY = Integer.parseInt(ystr);
					
					System.out.println("New location: " + ballX + " / " + ballY);
					
					s.getOutputStream().write(("HTTP/1.x 200 OK\n").getBytes());
					s.getOutputStream().write(("Access-Control-Allow-Origin: *\n").getBytes());
					s.getOutputStream().write(("\n").getBytes());
					s.getOutputStream().flush();
				} else {
					s.getOutputStream().write(("HTTP/1.x 200 OK\n").getBytes());
					s.getOutputStream().write(("Access-Control-Allow-Origin: *\n").getBytes());
					s.getOutputStream().write(("\n").getBytes());
					s.getOutputStream().write((ballX + "/" + ballY).getBytes());
					s.getOutputStream().flush();					
				}
				
				s.close();
				// System.out.println("Disconnected from client.");
			} catch (IOException e) {
				System.out.println("Stupid client!");
				e.printStackTrace();
			}
		}
    }
}