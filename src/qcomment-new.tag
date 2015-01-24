<qcommentnew class="qc-comment qc-new">
    <div class="qc-user qc-logged-out">
      <p>Sign in to post a comment.</p>
      <ul class="qc-login-opts">
        <li each={ providers }>
          <a href="#" class="provicer-{ name }" onclick={ login }>{ name }</a>
        </li>
      </ul>
    </div>
<!--     <div class="qc-user qc-logged-in">
      <div class="headshot">
        <img src="http://www.gravatar.com/avatar/e3f99640d60577f72086b54087423593.png?s=200">
      </div>
    </div> -->
    <form onsubmit={ comment }>
      <textarea rows="1" class="gc-new-body form-control disabled"></textarea>
      <button class="submit">Submit</button>
    </form>
    <hr/>
</qcommentnew>
