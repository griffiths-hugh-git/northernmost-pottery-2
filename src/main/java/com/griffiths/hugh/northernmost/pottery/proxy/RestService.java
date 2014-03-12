package com.griffiths.hugh.northernmost.pottery.proxy;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.IOUtils;

/**
 * Rest service which takes a URL and forwards the request. This allows AJAX
 * requests to perform cross-origin requests without violating browser security policies.
 * 
 * The request is formatted as follows: 
 * 		http://<domain>:<port>/rest/request?url=<url>
 * 
 * @author hugh
 * 
 */
@Path("/")
public class RestService {

	@GET
	@Path("request")
	public Response forwardRequest(@QueryParam("url") String msg)
			throws MalformedURLException, IOException {
		System.out.println("Got a message : " + msg);

		InputStream is = makeRequest(msg);
		String content = copyStream(is);

		return Response.status(Status.ACCEPTED).entity(content).build();
	}

	private InputStream makeRequest(String url) throws MalformedURLException,
			IOException {
		String decodedUrl = URLDecoder.decode(url);

		URLConnection connection = new URL(decodedUrl).openConnection();
		// connection.setRequestProperty("Accept-Charset", charset);
		InputStream response = connection.getInputStream();

		return response;
	}

	private static String copyStream(InputStream is) throws IOException {
		StringWriter writer = new StringWriter();
		IOUtils.copy(is, writer);
		String theString = writer.toString();
		return theString;
	}
}