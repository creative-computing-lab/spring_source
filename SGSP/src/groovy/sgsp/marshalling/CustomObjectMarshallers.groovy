package sgsp.marshalling

class CustomObjectMarshallers {
	List marshallers = [
		new UserMarshaller(),
		new PostsMarshaller(),
		new CommentMarshaller()
	]

	def register() {
		marshallers.each{ it.register() }
	}
}
